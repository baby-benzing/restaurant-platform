export { BaseRepository } from './base.repository';
export { RestaurantRepository } from './restaurant.repository';
export { 
  MenuRepository, 
  MenuSectionRepository, 
  MenuItemRepository 
} from './menu.repository';
export { UserRepository, type SafeUser } from './user.repository';

import { PrismaClient } from '@prisma/client';
import { RestaurantRepository } from './restaurant.repository';
import { MenuRepository, MenuSectionRepository, MenuItemRepository } from './menu.repository';
import { UserRepository } from './user.repository';

export class RepositoryFactory {
  private static instance: RepositoryFactory;
  private prisma: PrismaClient;
  
  private restaurantRepo: RestaurantRepository;
  private menuRepo: MenuRepository;
  private menuSectionRepo: MenuSectionRepository;
  private menuItemRepo: MenuItemRepository;
  private userRepo: UserRepository;

  private constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.restaurantRepo = new RestaurantRepository(prisma);
    this.menuRepo = new MenuRepository(prisma);
    this.menuSectionRepo = new MenuSectionRepository(prisma);
    this.menuItemRepo = new MenuItemRepository(prisma);
    this.userRepo = new UserRepository(prisma);
  }

  static getInstance(prisma: PrismaClient): RepositoryFactory {
    if (!RepositoryFactory.instance) {
      RepositoryFactory.instance = new RepositoryFactory(prisma);
    }
    return RepositoryFactory.instance;
  }

  get restaurant(): RestaurantRepository {
    return this.restaurantRepo;
  }

  get menu(): MenuRepository {
    return this.menuRepo;
  }

  get menuSection(): MenuSectionRepository {
    return this.menuSectionRepo;
  }

  get menuItem(): MenuItemRepository {
    return this.menuItemRepo;
  }

  get user(): UserRepository {
    return this.userRepo;
  }
}