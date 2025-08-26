/**
 * Menu Admin Service
 * Manages menu data for admin panel - uses the same data source as the public site
 */

import { getRestaurantData } from '@/lib/api';

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  category: string;
  isAvailable: boolean;
  sectionId: string;
  sectionName?: string;
  sortOrder: number;
  imageUrl?: string | null;
  allergens?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class MenuAdminService {
  /**
   * Get all menu items from the restaurant data
   */
  async getMenuItems(filter?: { category?: string; isAvailable?: boolean }): Promise<MenuItem[]> {
    try {
      const data = await getRestaurantData();
      const items: MenuItem[] = [];
      
      if (data.menus && data.menus.length > 0) {
        for (const menu of data.menus) {
          if (menu.sections) {
            for (const section of menu.sections) {
              if (section.items) {
                for (const item of section.items) {
                  // Create a unique ID from section and item name
                  const itemId = `${section.name}-${item.name}`.toLowerCase().replace(/\s+/g, '-');
                  
                  items.push({
                    id: itemId,
                    name: item.name,
                    description: item.description || null,
                    price: item.price || null,
                    category: section.name.toLowerCase().replace(/\s+/g, '_'),
                    sectionName: section.name,
                    sectionId: section.name.toLowerCase().replace(/\s+/g, '-'),
                    isAvailable: item.isAvailable !== false,
                    sortOrder: item.sortOrder || 999,
                    imageUrl: item.imageUrl || null,
                    allergens: item.allergens || [],
                  });
                }
              }
            }
          }
        }
      }

      // Apply filters
      let filteredItems = items;
      
      if (filter?.category && filter.category !== 'all') {
        filteredItems = filteredItems.filter(item => 
          item.category === filter.category ||
          item.sectionName?.toLowerCase().includes(filter.category.toLowerCase())
        );
      }
      
      if (filter?.isAvailable !== undefined) {
        filteredItems = filteredItems.filter(item => item.isAvailable === filter.isAvailable);
      }

      return filteredItems;
    } catch (error) {
      console.error('Error fetching menu items:', error);
      // Return empty array instead of throwing to prevent UI crashes
      return [];
    }
  }

  /**
   * Get a single menu item
   */
  async getMenuItem(id: string): Promise<MenuItem | null> {
    const items = await this.getMenuItems();
    return items.find(item => item.id === id) || null;
  }

  /**
   * Get all menu sections
   */
  async getMenuSections(): Promise<Array<{ id: string; name: string; menuName: string }>> {
    try {
      const data = await getRestaurantData();
      const sections: Array<{ id: string; name: string; menuName: string }> = [];
      
      if (data.menus && data.menus.length > 0) {
        for (const menu of data.menus) {
          if (menu.sections) {
            for (const section of menu.sections) {
              sections.push({
                id: section.name.toLowerCase().replace(/\s+/g, '-'),
                name: section.name,
                menuName: menu.name || 'Main Menu',
              });
            }
          }
        }
      }

      return sections;
    } catch (error) {
      console.error('Error fetching menu sections:', error);
      return [];
    }
  }

  /**
   * Note: Create, Update, and Delete operations would need to be implemented
   * with proper database access. For now, these are placeholders that would
   * need backend implementation.
   */
  async createMenuItem(input: any): Promise<MenuItem> {
    throw new Error('Create operation requires database access. Please implement backend API.');
  }

  async updateMenuItem(input: any): Promise<MenuItem> {
    throw new Error('Update operation requires database access. Please implement backend API.');
  }

  async deleteMenuItem(id: string): Promise<boolean> {
    throw new Error('Delete operation requires database access. Please implement backend API.');
  }
}

export const menuAdminService = new MenuAdminService();