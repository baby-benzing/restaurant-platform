import { BaseRepository } from '../../repositories/base.repository';
import type { PrismaClient } from '@prisma/client';

// Mock PrismaClient
const mockPrismaModel = {
  findUnique: jest.fn(),
  findFirst: jest.fn(),
  findMany: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
};

class TestRepository extends BaseRepository<any> {
  constructor(prisma: PrismaClient) {
    super(mockPrismaModel as any);
  }
}

describe('BaseRepository', () => {
  let repository: TestRepository;
  let mockPrisma: PrismaClient;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new TestRepository({} as PrismaClient);
  });

  describe('findById', () => {
    it('should find entity by id', async () => {
      const mockEntity = { id: '1', name: 'Test' };
      mockPrismaModel.findUnique.mockResolvedValue(mockEntity);

      const result = await repository.findById('1');

      expect(mockPrismaModel.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockEntity);
    });

    it('should return null when entity not found', async () => {
      mockPrismaModel.findUnique.mockResolvedValue(null);

      const result = await repository.findById('999');

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return all entities', async () => {
      const mockEntities = [
        { id: '1', name: 'Test 1' },
        { id: '2', name: 'Test 2' },
      ];
      mockPrismaModel.findMany.mockResolvedValue(mockEntities);

      const result = await repository.findAll();

      expect(mockPrismaModel.findMany).toHaveBeenCalledWith({});
      expect(result).toEqual(mockEntities);
    });

    it('should apply filters when provided', async () => {
      const mockEntities = [{ id: '1', name: 'Test' }];
      mockPrismaModel.findMany.mockResolvedValue(mockEntities);

      const result = await repository.findAll({ 
        where: { name: 'Test' },
        orderBy: { name: 'asc' },
      });

      expect(mockPrismaModel.findMany).toHaveBeenCalledWith({
        where: { name: 'Test' },
        orderBy: { name: 'asc' },
      });
      expect(result).toEqual(mockEntities);
    });
  });

  describe('create', () => {
    it('should create new entity', async () => {
      const newEntity = { name: 'New Test' };
      const createdEntity = { id: '1', ...newEntity };
      mockPrismaModel.create.mockResolvedValue(createdEntity);

      const result = await repository.create(newEntity);

      expect(mockPrismaModel.create).toHaveBeenCalledWith({
        data: newEntity,
      });
      expect(result).toEqual(createdEntity);
    });
  });

  describe('update', () => {
    it('should update existing entity', async () => {
      const updateData = { name: 'Updated' };
      const updatedEntity = { id: '1', ...updateData };
      mockPrismaModel.update.mockResolvedValue(updatedEntity);

      const result = await repository.update('1', updateData);

      expect(mockPrismaModel.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
      });
      expect(result).toEqual(updatedEntity);
    });

    it('should throw error when entity not found', async () => {
      mockPrismaModel.update.mockRejectedValue(new Error('Record not found'));

      await expect(repository.update('999', { name: 'Test' }))
        .rejects.toThrow('Record not found');
    });
  });

  describe('delete', () => {
    it('should delete entity by id', async () => {
      const deletedEntity = { id: '1', name: 'Test' };
      mockPrismaModel.delete.mockResolvedValue(deletedEntity);

      const result = await repository.delete('1');

      expect(mockPrismaModel.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(deletedEntity);
    });

    it('should throw error when entity not found', async () => {
      mockPrismaModel.delete.mockRejectedValue(new Error('Record not found'));

      await expect(repository.delete('999'))
        .rejects.toThrow('Record not found');
    });
  });

  describe('count', () => {
    it('should return total count', async () => {
      mockPrismaModel.count.mockResolvedValue(10);

      const result = await repository.count();

      expect(mockPrismaModel.count).toHaveBeenCalledWith({
        where: {},
      });
      expect(result).toBe(10);
    });

    it('should count with filters', async () => {
      mockPrismaModel.count.mockResolvedValue(5);

      const result = await repository.count({ name: 'Test' });

      expect(mockPrismaModel.count).toHaveBeenCalledWith({
        where: { name: 'Test' },
      });
      expect(result).toBe(5);
    });
  });
});