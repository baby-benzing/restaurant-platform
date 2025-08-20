import { MenuService, MenuItem, CreateMenuItemInput, UpdateMenuItemInput } from '../menu.service';

// Mock the prisma module
jest.mock('@restaurant-platform/database', () => ({
  prisma: {
    restaurant: {
      findUnique: jest.fn(),
    },
    menu: {
      findMany: jest.fn(),
    },
    menuItem: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import { prisma } from '@restaurant-platform/database';

describe('MenuService', () => {
  let service: MenuService;
  const mockRestaurantId = 'test-restaurant-id';
  const mockMenuData = [
    {
      id: 'menu-1',
      name: 'Main Menu',
      isActive: true,
      sortOrder: 1,
      sections: [
        {
          id: 'section-1',
          name: 'appetizers',
          sortOrder: 1,
          items: [
            {
              id: 'item-1',
              name: 'Poke Bowl',
              description: 'Fresh tuna poke',
              price: 18,
              isAvailable: true,
              sortOrder: 1,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        },
        {
          id: 'section-2',
          name: 'mains',
          sortOrder: 2,
          items: [
            {
              id: 'item-2',
              name: 'Kalua Pork',
              description: 'Slow-cooked pork',
              price: 28,
              isAvailable: true,
              sortOrder: 1,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        },
      ],
    },
  ];

  beforeEach(() => {
    service = new MenuService();
    jest.clearAllMocks();
    
    // Mock getRestaurantId
    (prisma.restaurant.findUnique as jest.Mock).mockResolvedValue({
      id: mockRestaurantId,
      slug: 'test-restaurant',
    });
  });

  describe('getMenuItems', () => {
    it('should return all menu items', async () => {
      (prisma.menu.findMany as jest.Mock).mockResolvedValue(mockMenuData);
      
      const items = await service.getMenuItems();
      
      expect(Array.isArray(items)).toBe(true);
      expect(items).toHaveLength(2);
      expect(items[0]).toHaveProperty('id', 'item-1');
      expect(items[0]).toHaveProperty('name', 'Poke Bowl');
      expect(items[0]).toHaveProperty('price', 18);
      expect(items[0]).toHaveProperty('category', 'appetizers');
      expect(items[1]).toHaveProperty('id', 'item-2');
      expect(items[1]).toHaveProperty('category', 'mains');
    });

    it('should filter by category', async () => {
      (prisma.menu.findMany as jest.Mock).mockResolvedValue(mockMenuData);
      
      const items = await service.getMenuItems({ category: 'appetizers' });
      
      expect(items).toHaveLength(1);
      expect(items[0].category).toBe('appetizers');
    });
  });

  describe('getMenuItem', () => {
    it('should return a specific menu item by id', async () => {
      const mockItem = {
        id: 'item-1',
        name: 'Poke Bowl',
        description: 'Fresh tuna poke',
        price: 18,
        isAvailable: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        section: {
          id: 'section-1',
          name: 'appetizers',
        },
      };
      
      (prisma.menuItem.findUnique as jest.Mock).mockResolvedValue(mockItem);
      
      const item = await service.getMenuItem('item-1');
      
      expect(item).toBeDefined();
      expect(item?.id).toBe('item-1');
      expect(item?.name).toBe('Poke Bowl');
      expect(item?.category).toBe('appetizers');
    });

    it('should return null for non-existent id', async () => {
      (prisma.menuItem.findUnique as jest.Mock).mockResolvedValue(null);
      
      const item = await service.getMenuItem('non-existent-id');
      
      expect(item).toBeNull();
    });
  });

  describe('createMenuItem', () => {
    it('should create a new menu item', async () => {
      const newItemData: CreateMenuItemInput = {
        name: 'Test Item',
        description: 'Test description',
        price: 25.99,
        sectionId: 'section-2',
        isAvailable: true,
      };

      const mockCreatedItem = {
        id: 'new-item-id',
        ...newItemData,
        sortOrder: 999,
        createdAt: new Date(),
        updatedAt: new Date(),
        section: {
          id: 'section-2',
          name: 'mains',
        },
      };
      
      (prisma.menuItem.create as jest.Mock).mockResolvedValue(mockCreatedItem);
      
      const createdItem = await service.createMenuItem(newItemData);
      
      expect(createdItem).toBeDefined();
      expect(createdItem.id).toBe('new-item-id');
      expect(createdItem.name).toBe(newItemData.name);
      expect(createdItem.description).toBe(newItemData.description);
      expect(createdItem.price).toBe(newItemData.price);
      expect(createdItem.category).toBe('mains');
      expect(createdItem.createdAt).toBeInstanceOf(Date);
      expect(createdItem.updatedAt).toBeInstanceOf(Date);
    });

    it('should set default values for optional fields', async () => {
      const newItemData: CreateMenuItemInput = {
        name: 'Minimal Item',
        description: 'Minimal description',
        price: 10,
        sectionId: 'section-1',
      };

      const mockCreatedItem = {
        id: 'minimal-item-id',
        ...newItemData,
        isAvailable: true,
        sortOrder: 999,
        createdAt: new Date(),
        updatedAt: new Date(),
        section: {
          id: 'section-1',
          name: 'appetizers',
        },
      };
      
      (prisma.menuItem.create as jest.Mock).mockResolvedValue(mockCreatedItem);
      
      const createdItem = await service.createMenuItem(newItemData);
      
      expect(createdItem.isAvailable).toBe(true);
      expect(prisma.menuItem.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            isAvailable: true,
            sortOrder: 999,
          }),
        })
      );
    });
  });

  describe('updateMenuItem', () => {
    it('should update an existing menu item', async () => {
      const updateData: UpdateMenuItemInput = {
        id: 'item-1',
        name: 'Updated Name',
        price: 99.99,
      };

      const mockUpdatedItem = {
        id: 'item-1',
        name: 'Updated Name',
        description: 'Fresh tuna poke',
        price: 99.99,
        isAvailable: true,
        sortOrder: 1,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
        section: {
          id: 'section-1',
          name: 'appetizers',
        },
      };
      
      (prisma.menuItem.update as jest.Mock).mockResolvedValue(mockUpdatedItem);
      
      const updatedItem = await service.updateMenuItem(updateData);
      
      expect(updatedItem).toBeDefined();
      expect(updatedItem.id).toBe('item-1');
      expect(updatedItem.name).toBe('Updated Name');
      expect(updatedItem.price).toBe(99.99);
      expect(updatedItem.description).toBe('Fresh tuna poke');
    });

    it('should throw error for non-existent id', async () => {
      const updateData: UpdateMenuItemInput = {
        id: 'non-existent-id',
        name: 'Updated Name',
      };

      (prisma.menuItem.update as jest.Mock).mockRejectedValue(new Error('Not found'));
      
      await expect(service.updateMenuItem(updateData)).rejects.toThrow('Failed to update menu item');
    });

    it('should update only specified fields', async () => {
      const updateData: UpdateMenuItemInput = {
        id: 'item-1',
        isAvailable: false,
      };

      const mockUpdatedItem = {
        id: 'item-1',
        name: 'Poke Bowl',
        description: 'Fresh tuna poke',
        price: 18,
        isAvailable: false,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        section: {
          id: 'section-1',
          name: 'appetizers',
        },
      };
      
      (prisma.menuItem.update as jest.Mock).mockResolvedValue(mockUpdatedItem);
      
      const updatedItem = await service.updateMenuItem(updateData);
      
      expect(updatedItem.isAvailable).toBe(false);
      expect(updatedItem.name).toBe('Poke Bowl');
      expect(updatedItem.price).toBe(18);
    });
  });

  describe('deleteMenuItem', () => {
    it('should delete an existing menu item', async () => {
      (prisma.menuItem.delete as jest.Mock).mockResolvedValue({ id: 'item-1' });
      
      const result = await service.deleteMenuItem('item-1');
      
      expect(result).toBe(true);
      expect(prisma.menuItem.delete).toHaveBeenCalledWith({
        where: { id: 'item-1' },
      });
    });

    it('should return false for non-existent id', async () => {
      (prisma.menuItem.delete as jest.Mock).mockRejectedValue(new Error('Not found'));
      
      const result = await service.deleteMenuItem('non-existent-id');
      
      expect(result).toBe(false);
    });
  });

  describe('getMenuSections', () => {
    it('should return all menu sections', async () => {
      (prisma.menu.findMany as jest.Mock).mockResolvedValue(mockMenuData);
      
      const sections = await service.getMenuSections();
      
      expect(Array.isArray(sections)).toBe(true);
      expect(sections).toHaveLength(2);
      expect(sections[0]).toEqual({
        id: 'section-1',
        name: 'appetizers',
        menuName: 'Main Menu',
      });
      expect(sections[1]).toEqual({
        id: 'section-2',
        name: 'mains',
        menuName: 'Main Menu',
      });
    });

    it('should return empty array when no menus exist', async () => {
      (prisma.menu.findMany as jest.Mock).mockResolvedValue([]);
      
      const sections = await service.getMenuSections();
      
      expect(sections).toEqual([]);
    });
  });
});