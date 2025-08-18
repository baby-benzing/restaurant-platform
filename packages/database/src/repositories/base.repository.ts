export abstract class BaseRepository<T> {
  constructor(protected model: any) {}

  async findById(id: string): Promise<T | null> {
    return this.model.findUnique({
      where: { id },
    });
  }

  async findAll(params?: {
    where?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
    include?: any;
  }): Promise<T[]> {
    return this.model.findMany(params || {});
  }

  async findFirst(params?: {
    where?: any;
    orderBy?: any;
    include?: any;
  }): Promise<T | null> {
    return this.model.findFirst(params || {});
  }

  async create(data: any): Promise<T> {
    return this.model.create({
      data,
    });
  }

  async update(id: string, data: any): Promise<T> {
    return this.model.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<T> {
    return this.model.delete({
      where: { id },
    });
  }

  async count(where?: any): Promise<number> {
    return this.model.count({
      where: where || {},
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.model.count({
      where: { id },
    });
    return count > 0;
  }

  async createMany(data: any[]): Promise<{ count: number }> {
    return this.model.createMany({
      data,
      skipDuplicates: true,
    });
  }

  async updateMany(where: any, data: any): Promise<{ count: number }> {
    return this.model.updateMany({
      where,
      data,
    });
  }

  async deleteMany(where: any): Promise<{ count: number }> {
    return this.model.deleteMany({
      where,
    });
  }
}