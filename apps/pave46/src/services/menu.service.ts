import { prisma } from '@restaurant-platform/database';

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
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMenuItemInput {
  name: string;
  description?: string;
  price?: number;
  sectionId: string;
  isAvailable?: boolean;
  sortOrder?: number;
}

export interface UpdateMenuItemInput extends Partial<CreateMenuItemInput> {
  id: string;
  category?: string;
  imageUrl?: string | null;
  allergens?: string[];
}

export class MenuService {
  async getRestaurantId(): Promise<string> {
    // Default to 'pave' which is the seeded restaurant slug
    const slug = 'pave';
    const restaurant = await prisma.restaurant.findUnique({
      where: { slug },
    });
    if (!restaurant) {
      throw new Error(`Restaurant with slug ${slug} not found`);
    }
    return restaurant.id;
  }

  async getMenuItems(filter?: { category?: string; isAvailable?: boolean }): Promise<MenuItem[]> {
    try {
      const restaurantId = await this.getRestaurantId();
      
      const menus = await prisma.menu.findMany({
        where: { restaurantId, isActive: true },
        include: {
          sections: {
            include: {
              items: {
                where: filter?.isAvailable !== undefined 
                  ? { isAvailable: filter.isAvailable }
                  : undefined,
                orderBy: { sortOrder: 'asc' },
              },
            },
            orderBy: { sortOrder: 'asc' },
          },
        },
        orderBy: { sortOrder: 'asc' },
      });

      // Flatten menu items with section information
      const items: MenuItem[] = [];
      for (const menu of menus) {
        for (const section of menu.sections) {
          for (const item of section.items) {
            items.push({
              id: item.id,
              name: item.name,
              description: item.description,
              price: item.price,
              category: section.name,
              sectionName: section.name,
              sectionId: section.id,
              isAvailable: item.isAvailable,
              sortOrder: item.sortOrder,
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
            });
          }
        }
      }

      // Filter by category if provided
      if (filter?.category) {
        return items.filter(item => 
          item.category.toLowerCase().includes(filter.category!.toLowerCase())
        );
      }

      return items;
    } catch (error) {
      console.error('Error fetching menu items:', error);
      return [];
    }
  }

  async getMenuItem(id: string): Promise<MenuItem | null> {
    try {
      const item = await prisma.menuItem.findUnique({
        where: { id },
        include: {
          section: true,
        },
      });

      if (!item) return null;

      return {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.section.name,
        sectionName: item.section.name,
        sectionId: item.section.id,
        isAvailable: item.isAvailable,
        sortOrder: item.sortOrder,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    } catch (error) {
      console.error('Error fetching menu item:', error);
      return null;
    }
  }

  async createMenuItem(input: CreateMenuItemInput): Promise<MenuItem> {
    try {
      const item = await prisma.menuItem.create({
        data: {
          name: input.name,
          description: input.description,
          price: input.price,
          sectionId: input.sectionId,
          isAvailable: input.isAvailable ?? true,
          sortOrder: input.sortOrder ?? 999,
        },
        include: {
          section: true,
        },
      });

      return {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.section.name,
        sectionName: item.section.name,
        sectionId: item.section.id,
        isAvailable: item.isAvailable,
        sortOrder: item.sortOrder,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    } catch (error) {
      console.error('Error creating menu item:', error);
      throw new Error('Failed to create menu item');
    }
  }

  async updateMenuItem(input: UpdateMenuItemInput): Promise<MenuItem> {
    try {
      const item = await prisma.menuItem.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
          price: input.price,
          sectionId: input.sectionId,
          isAvailable: input.isAvailable,
          sortOrder: input.sortOrder,
        },
        include: {
          section: true,
        },
      });

      return {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.section.name,
        sectionName: item.section.name,
        sectionId: item.section.id,
        isAvailable: item.isAvailable,
        sortOrder: item.sortOrder,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    } catch (error) {
      console.error('Error updating menu item:', error);
      throw new Error('Failed to update menu item');
    }
  }

  async deleteMenuItem(id: string): Promise<boolean> {
    try {
      await prisma.menuItem.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error('Error deleting menu item:', error);
      return false;
    }
  }

  async getMenuSections(): Promise<Array<{ id: string; name: string; menuName: string }>> {
    try {
      const restaurantId = await this.getRestaurantId();
      
      const menus = await prisma.menu.findMany({
        where: { restaurantId, isActive: true },
        include: {
          sections: {
            orderBy: { sortOrder: 'asc' },
          },
        },
        orderBy: { sortOrder: 'asc' },
      });

      const sections: Array<{ id: string; name: string; menuName: string }> = [];
      for (const menu of menus) {
        for (const section of menu.sections) {
          sections.push({
            id: section.id,
            name: section.name,
            menuName: menu.name,
          });
        }
      }

      return sections;
    } catch (error) {
      console.error('Error fetching menu sections:', error);
      return [];
    }
  }
}

export const menuService = new MenuService();