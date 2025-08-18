import { RestaurantRepository } from '../../repositories/restaurant.repository';
import type { PrismaClient } from '@prisma/client';

const mockPrismaClient = {
  restaurant: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
} as unknown as PrismaClient;

describe('RestaurantRepository', () => {
  let repository: RestaurantRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new RestaurantRepository(mockPrismaClient);
  });

  describe('findBySlug', () => {
    it('should find restaurant by slug', async () => {
      const mockRestaurant = {
        id: '1',
        slug: 'pave46',
        name: 'Pavé46',
        description: 'Test restaurant',
      };
      
      mockPrismaClient.restaurant.findUnique.mockResolvedValue(mockRestaurant);

      const result = await repository.findBySlug('pave46');

      expect(mockPrismaClient.restaurant.findUnique).toHaveBeenCalledWith({
        where: { slug: 'pave46' },
      });
      expect(result).toEqual(mockRestaurant);
    });

    it('should return null when restaurant not found', async () => {
      mockPrismaClient.restaurant.findUnique.mockResolvedValue(null);

      const result = await repository.findBySlug('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('findBySlugWithRelations', () => {
    it('should find restaurant with all relations', async () => {
      const mockRestaurantWithRelations = {
        id: '1',
        slug: 'pave46',
        name: 'Pavé46',
        menus: [],
        hours: [],
        contacts: [],
        images: [],
      };
      
      mockPrismaClient.restaurant.findUnique.mockResolvedValue(mockRestaurantWithRelations);

      const result = await repository.findBySlugWithRelations('pave46');

      expect(mockPrismaClient.restaurant.findUnique).toHaveBeenCalledWith({
        where: { slug: 'pave46' },
        include: expect.objectContaining({
          menus: expect.any(Object),
          hours: expect.any(Object),
          contacts: expect.any(Object),
          images: expect.any(Object),
        }),
      });
      expect(result).toEqual(mockRestaurantWithRelations);
    });
  });

  describe('createWithRelations', () => {
    it('should create restaurant with hours and contacts', async () => {
      const createData = {
        restaurant: {
          slug: 'test-restaurant',
          name: 'Test Restaurant',
        },
        hours: [
          { dayOfWeek: 1, openTime: '09:00', closeTime: '22:00', isClosed: false },
        ],
        contacts: [
          { type: 'phone', value: '123-456-7890' },
        ],
      };

      const mockCreatedRestaurant = {
        id: '1',
        ...createData.restaurant,
        hours: createData.hours,
        contacts: createData.contacts,
      };

      mockPrismaClient.restaurant.create.mockResolvedValue(mockCreatedRestaurant);

      const result = await repository.createWithRelations(createData);

      expect(mockPrismaClient.restaurant.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          ...createData.restaurant,
          hours: { create: createData.hours },
          contacts: { create: createData.contacts },
        }),
        include: {
          hours: true,
          contacts: true,
        },
      });
      expect(result).toEqual(mockCreatedRestaurant);
    });
  });

  describe('updateBySlug', () => {
    it('should update restaurant by slug', async () => {
      const mockRestaurant = { id: '1', slug: 'pave46', name: 'Pavé46' };
      mockPrismaClient.restaurant.findUnique.mockResolvedValue(mockRestaurant);
      
      const updatedRestaurant = { ...mockRestaurant, name: 'Updated Name' };
      mockPrismaClient.restaurant.update.mockResolvedValue(updatedRestaurant);

      const result = await repository.updateBySlug('pave46', { name: 'Updated Name' });

      expect(mockPrismaClient.restaurant.update).toHaveBeenCalledWith({
        where: { slug: 'pave46' },
        data: { name: 'Updated Name' },
      });
      expect(result).toEqual(updatedRestaurant);
    });

    it('should throw error when restaurant not found', async () => {
      mockPrismaClient.restaurant.findUnique.mockResolvedValue(null);

      await expect(
        repository.updateBySlug('nonexistent', { name: 'Test' })
      ).rejects.toThrow('Restaurant with id nonexistent not found');
    });
  });

  describe('deleteBySlug', () => {
    it('should delete restaurant by slug', async () => {
      const mockRestaurant = { id: '1', slug: 'pave46', name: 'Pavé46' };
      mockPrismaClient.restaurant.findUnique.mockResolvedValue(mockRestaurant);
      mockPrismaClient.restaurant.delete.mockResolvedValue(mockRestaurant);

      const result = await repository.deleteBySlug('pave46');

      expect(mockPrismaClient.restaurant.delete).toHaveBeenCalledWith({
        where: { slug: 'pave46' },
      });
      expect(result).toEqual(mockRestaurant);
    });

    it('should throw error when restaurant not found', async () => {
      mockPrismaClient.restaurant.findUnique.mockResolvedValue(null);

      await expect(
        repository.deleteBySlug('nonexistent')
      ).rejects.toThrow('Restaurant with id nonexistent not found');
    });
  });

  describe('getActiveRestaurants', () => {
    it('should return all restaurants ordered by name', async () => {
      const mockRestaurants = [
        { id: '1', slug: 'restaurant-a', name: 'Restaurant A' },
        { id: '2', slug: 'restaurant-b', name: 'Restaurant B' },
      ];
      
      mockPrismaClient.restaurant.findMany.mockResolvedValue(mockRestaurants);

      const result = await repository.getActiveRestaurants();

      expect(mockPrismaClient.restaurant.findMany).toHaveBeenCalledWith({
        orderBy: { name: 'asc' },
      });
      expect(result).toEqual(mockRestaurants);
    });
  });
});