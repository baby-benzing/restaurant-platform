import { MenuService, MenuItem, CreateMenuItemInput, UpdateMenuItemInput } from '../menu.service';

describe('MenuService', () => {
  let service: MenuService;

  beforeEach(() => {
    service = new MenuService();
  });

  describe('getMenuItems', () => {
    it('should return all menu items', async () => {
      const items = await service.getMenuItems();
      
      expect(Array.isArray(items)).toBe(true);
      expect(items.length).toBeGreaterThan(0);
      expect(items[0]).toHaveProperty('id');
      expect(items[0]).toHaveProperty('name');
      expect(items[0]).toHaveProperty('price');
      expect(items[0]).toHaveProperty('category');
    });
  });

  describe('getMenuItem', () => {
    it('should return a specific menu item by id', async () => {
      const allItems = await service.getMenuItems();
      const firstItem = allItems[0];
      
      const item = await service.getMenuItem(firstItem.id);
      
      expect(item).toBeDefined();
      expect(item?.id).toBe(firstItem.id);
      expect(item?.name).toBe(firstItem.name);
    });

    it('should return null for non-existent id', async () => {
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
        category: 'mains',
        isAvailable: true,
        allergens: ['gluten', 'dairy'],
      };

      const createdItem = await service.createMenuItem(newItemData);
      
      expect(createdItem).toBeDefined();
      expect(createdItem.id).toBeDefined();
      expect(createdItem.name).toBe(newItemData.name);
      expect(createdItem.description).toBe(newItemData.description);
      expect(createdItem.price).toBe(newItemData.price);
      expect(createdItem.category).toBe(newItemData.category);
      expect(createdItem.allergens).toEqual(newItemData.allergens);
      expect(createdItem.createdAt).toBeInstanceOf(Date);
      expect(createdItem.updatedAt).toBeInstanceOf(Date);
    });

    it('should set default values for optional fields', async () => {
      const newItemData: CreateMenuItemInput = {
        name: 'Minimal Item',
        description: 'Minimal description',
        price: 10,
        category: 'appetizers',
      };

      const createdItem = await service.createMenuItem(newItemData);
      
      expect(createdItem.isAvailable).toBe(true);
      expect(createdItem.allergens).toEqual([]);
    });

    it('should add the created item to the list', async () => {
      const initialItems = await service.getMenuItems();
      const initialCount = initialItems.length;

      const newItemData: CreateMenuItemInput = {
        name: 'New Test Item',
        description: 'New test description',
        price: 15,
        category: 'desserts',
      };

      await service.createMenuItem(newItemData);
      const updatedItems = await service.getMenuItems();
      
      expect(updatedItems.length).toBe(initialCount + 1);
      expect(updatedItems.some(item => item.name === 'New Test Item')).toBe(true);
    });
  });

  describe('updateMenuItem', () => {
    it('should update an existing menu item', async () => {
      const allItems = await service.getMenuItems();
      const itemToUpdate = allItems[0];
      
      const updateData: UpdateMenuItemInput = {
        id: itemToUpdate.id,
        name: 'Updated Name',
        price: 99.99,
      };

      const updatedItem = await service.updateMenuItem(updateData);
      
      expect(updatedItem).toBeDefined();
      expect(updatedItem?.id).toBe(itemToUpdate.id);
      expect(updatedItem?.name).toBe('Updated Name');
      expect(updatedItem?.price).toBe(99.99);
      expect(updatedItem?.description).toBe(itemToUpdate.description); // Unchanged
      expect(updatedItem?.updatedAt.getTime()).toBeGreaterThan(itemToUpdate.updatedAt.getTime());
    });

    it('should return null for non-existent id', async () => {
      const updateData: UpdateMenuItemInput = {
        id: 'non-existent-id',
        name: 'Updated Name',
      };

      const result = await service.updateMenuItem(updateData);
      
      expect(result).toBeNull();
    });

    it('should update only specified fields', async () => {
      const allItems = await service.getMenuItems();
      const itemToUpdate = allItems[0];
      
      const updateData: UpdateMenuItemInput = {
        id: itemToUpdate.id,
        isAvailable: false,
      };

      const updatedItem = await service.updateMenuItem(updateData);
      
      expect(updatedItem?.isAvailable).toBe(false);
      expect(updatedItem?.name).toBe(itemToUpdate.name);
      expect(updatedItem?.price).toBe(itemToUpdate.price);
    });
  });

  describe('deleteMenuItem', () => {
    it('should delete an existing menu item', async () => {
      const allItems = await service.getMenuItems();
      const itemToDelete = allItems[0];
      const initialCount = allItems.length;
      
      const result = await service.deleteMenuItem(itemToDelete.id);
      
      expect(result).toBe(true);
      
      const updatedItems = await service.getMenuItems();
      expect(updatedItems.length).toBe(initialCount - 1);
      expect(updatedItems.some(item => item.id === itemToDelete.id)).toBe(false);
    });

    it('should return false for non-existent id', async () => {
      const result = await service.deleteMenuItem('non-existent-id');
      
      expect(result).toBe(false);
    });
  });

  describe('getMenuItemsByCategory', () => {
    it('should return items for a specific category', async () => {
      const appetizers = await service.getMenuItemsByCategory('appetizers');
      
      expect(Array.isArray(appetizers)).toBe(true);
      expect(appetizers.every(item => item.category === 'appetizers')).toBe(true);
    });

    it('should return empty array for category with no items', async () => {
      // First, remove all items of a category
      const allItems = await service.getMenuItems();
      const beverageItems = allItems.filter(item => item.category === 'beverages');
      
      for (const item of beverageItems) {
        await service.deleteMenuItem(item.id);
      }
      
      const beverages = await service.getMenuItemsByCategory('beverages');
      
      expect(beverages).toEqual([]);
    });

    it('should return correct items after adding to category', async () => {
      const newItem: CreateMenuItemInput = {
        name: 'Test Cocktail',
        description: 'Test cocktail description',
        price: 18,
        category: 'cocktails',
      };

      await service.createMenuItem(newItem);
      
      const cocktails = await service.getMenuItemsByCategory('cocktails');
      
      expect(cocktails.some(item => item.name === 'Test Cocktail')).toBe(true);
    });
  });
});