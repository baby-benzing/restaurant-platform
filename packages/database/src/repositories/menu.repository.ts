import { BaseRepository } from './base.repository';
import type { Menu, MenuSection, MenuItem, Prisma, PrismaClient } from '@prisma/client';
import { RecordNotFoundError } from '../utils/errors';

export class MenuRepository extends BaseRepository<Menu> {
  constructor(private prisma: PrismaClient) {
    super(prisma.menu);
  }

  async findWithSections(menuId: string): Promise<Menu | null> {
    return this.model.findUnique({
      where: { id: menuId },
      include: {
        sections: {
          orderBy: { sortOrder: 'asc' },
          include: {
            items: {
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    });
  }

  async findByRestaurant(restaurantId: string): Promise<Menu[]> {
    return this.model.findMany({
      where: { restaurantId },
      orderBy: { sortOrder: 'asc' },
      include: {
        sections: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  }

  async createWithSections(data: {
    menu: Omit<Prisma.MenuCreateInput, 'restaurant'> & { restaurantId: string };
    sections?: Array<{
      name: string;
      description?: string;
      sortOrder?: number;
      items?: Array<Omit<Prisma.MenuItemCreateInput, 'section'>>;
    }>;
  }): Promise<Menu> {
    return this.prisma.menu.create({
      data: {
        ...data.menu,
        sections: data.sections
          ? {
              create: data.sections.map((section) => ({
                ...section,
                items: section.items ? { create: section.items } : undefined,
              })),
            }
          : undefined,
      },
      include: {
        sections: {
          include: {
            items: true,
          },
        },
      },
    });
  }

  async toggleActive(menuId: string): Promise<Menu> {
    const menu = await this.findById(menuId);
    if (!menu) {
      throw new RecordNotFoundError('Menu', menuId);
    }

    return this.update(menuId, {
      isActive: !menu.isActive,
    });
  }

  async reorderSections(menuId: string, sectionIds: string[]): Promise<void> {
    const updates = sectionIds.map((id, index) =>
      this.prisma.menuSection.update({
        where: { id },
        data: { sortOrder: index },
      })
    );

    await this.prisma.$transaction(updates);
  }
}

export class MenuSectionRepository extends BaseRepository<MenuSection> {
  constructor(private prisma: PrismaClient) {
    super(prisma.menuSection);
  }

  async findWithItems(sectionId: string): Promise<MenuSection | null> {
    return this.model.findUnique({
      where: { id: sectionId },
      include: {
        items: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  }

  async addItem(
    sectionId: string,
    item: Omit<Prisma.MenuItemCreateInput, 'section'>
  ): Promise<MenuItem> {
    return this.prisma.menuItem.create({
      data: {
        ...item,
        sectionId,
      },
    });
  }

  async reorderItems(sectionId: string, itemIds: string[]): Promise<void> {
    const updates = itemIds.map((id, index) =>
      this.prisma.menuItem.update({
        where: { id },
        data: { sortOrder: index },
      })
    );

    await this.prisma.$transaction(updates);
  }
}

export class MenuItemRepository extends BaseRepository<MenuItem> {
  constructor(private prisma: PrismaClient) {
    super(prisma.menuItem);
  }

  async toggleAvailability(itemId: string): Promise<MenuItem> {
    const item = await this.findById(itemId);
    if (!item) {
      throw new RecordNotFoundError('MenuItem', itemId);
    }

    return this.update(itemId, {
      isAvailable: !item.isAvailable,
    });
  }

  async updatePrice(itemId: string, price: number): Promise<MenuItem> {
    return this.update(itemId, { price });
  }

  async findBySectionId(sectionId: string): Promise<MenuItem[]> {
    return this.model.findMany({
      where: { sectionId },
      orderBy: { sortOrder: 'asc' },
    });
  }
}