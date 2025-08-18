import { BaseRepository } from './base.repository';
import type { Restaurant, Prisma, PrismaClient } from '@prisma/client';
import { RecordNotFoundError } from '../utils/errors';

export class RestaurantRepository extends BaseRepository<Restaurant> {
  constructor(private prisma: PrismaClient) {
    super(prisma.restaurant);
  }

  async findBySlug(slug: string): Promise<Restaurant | null> {
    return this.model.findUnique({
      where: { slug },
    });
  }

  async findBySlugWithRelations(slug: string): Promise<Restaurant | null> {
    return this.model.findUnique({
      where: { slug },
      include: {
        menus: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            sections: {
              orderBy: { sortOrder: 'asc' },
              include: {
                items: {
                  where: { isAvailable: true },
                  orderBy: { sortOrder: 'asc' },
                },
              },
            },
          },
        },
        hours: {
          orderBy: { dayOfWeek: 'asc' },
        },
        contacts: {
          orderBy: { sortOrder: 'asc' },
        },
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  }

  async createWithRelations(data: {
    restaurant: Prisma.RestaurantCreateInput;
    hours?: Array<Omit<Prisma.OperatingHoursCreateInput, 'restaurant'>>;
    contacts?: Array<Omit<Prisma.ContactCreateInput, 'restaurant'>>;
  }): Promise<Restaurant> {
    return this.prisma.restaurant.create({
      data: {
        ...data.restaurant,
        hours: data.hours ? { create: data.hours } : undefined,
        contacts: data.contacts ? { create: data.contacts } : undefined,
      },
      include: {
        hours: true,
        contacts: true,
      },
    });
  }

  async updateBySlug(
    slug: string,
    data: Prisma.RestaurantUpdateInput
  ): Promise<Restaurant> {
    const exists = await this.findBySlug(slug);
    if (!exists) {
      throw new RecordNotFoundError('Restaurant', slug);
    }

    return this.model.update({
      where: { slug },
      data,
    });
  }

  async deleteBySlug(slug: string): Promise<Restaurant> {
    const exists = await this.findBySlug(slug);
    if (!exists) {
      throw new RecordNotFoundError('Restaurant', slug);
    }

    return this.model.delete({
      where: { slug },
    });
  }

  async getActiveRestaurants(): Promise<Restaurant[]> {
    return this.model.findMany({
      orderBy: { name: 'asc' },
    });
  }
}