import { PrismaClient, Wine, WineType, WineInventoryStatus, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export interface WineFilter {
  type?: WineType;
  minPrice?: number;
  maxPrice?: number;
  region?: string;
  country?: string;
  grapeVariety?: string;
  inventoryStatus?: WineInventoryStatus;
  featured?: boolean;
  search?: string;
}

export interface WineImportData {
  name: string;
  producer?: string;
  vintage?: number;
  region?: string;
  country?: string;
  grapeVarieties?: string[];
  type: string;
  price?: number;
  glassPrice?: number;
  bottlePrice?: number;
  tastingNotes?: string;
  foodPairings?: string[];
  inventoryStatus?: string;
}

class WineService {
  async getWines(
    restaurantId: string,
    filter: WineFilter = {},
    page = 1,
    limit = 50
  ): Promise<{ wines: Wine[]; total: number }> {
    const where: Prisma.WineWhereInput = {
      restaurantId,
      isActive: true,
    };

    if (filter.type) {
      where.type = filter.type;
    }

    if (filter.minPrice || filter.maxPrice) {
      where.bottlePrice = {};
      if (filter.minPrice) {
        where.bottlePrice.gte = filter.minPrice;
      }
      if (filter.maxPrice) {
        where.bottlePrice.lte = filter.maxPrice;
      }
    }

    if (filter.region) {
      where.region = {
        contains: filter.region,
        mode: 'insensitive',
      };
    }

    if (filter.country) {
      where.country = {
        contains: filter.country,
        mode: 'insensitive',
      };
    }

    if (filter.grapeVariety) {
      where.grapeVarieties = {
        has: filter.grapeVariety,
      };
    }

    if (filter.inventoryStatus) {
      where.inventoryStatus = filter.inventoryStatus;
    }

    if (filter.featured !== undefined) {
      where.featured = filter.featured;
    }

    if (filter.search) {
      where.OR = [
        { name: { contains: filter.search, mode: 'insensitive' } },
        { producer: { contains: filter.search, mode: 'insensitive' } },
        { region: { contains: filter.search, mode: 'insensitive' } },
        { country: { contains: filter.search, mode: 'insensitive' } },
        { tastingNotes: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    const [wines, total] = await Promise.all([
      prisma.wine.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [
          { featured: 'desc' },
          { displayOrder: 'asc' },
          { type: 'asc' },
          { name: 'asc' },
        ],
      }),
      prisma.wine.count({ where }),
    ]);

    return { wines, total };
  }

  async getWineById(id: string): Promise<Wine | null> {
    return prisma.wine.findUnique({
      where: { id },
    });
  }

  async createWine(restaurantId: string, data: Partial<Wine>): Promise<Wine> {
    return prisma.wine.create({
      data: {
        ...data,
        restaurantId,
        type: data.type || WineType.RED,
        grapeVarieties: data.grapeVarieties || [],
        foodPairings: data.foodPairings || [],
      } as Prisma.WineCreateInput,
    });
  }

  async updateWine(id: string, data: Partial<Wine>): Promise<Wine> {
    const oldWine = await this.getWineById(id);
    
    const updatedWine = await prisma.wine.update({
      where: { id },
      data: data as Prisma.WineUpdateInput,
    });

    // Track the update
    if (oldWine) {
      await prisma.wineUpdate.create({
        data: {
          wineId: id,
          updateType: 'UPDATE',
          oldData: oldWine as any,
          newData: updatedWine as any,
        },
      });
    }

    return updatedWine;
  }

  async deleteWine(id: string): Promise<boolean> {
    try {
      await prisma.wine.update({
        where: { id },
        data: { isActive: false },
      });
      return true;
    } catch {
      return false;
    }
  }

  async importWines(
    restaurantId: string,
    wines: WineImportData[],
    fileName: string,
    userId?: string
  ): Promise<{ success: number; errors: string[] }> {
    const importRecord = await prisma.wineImport.create({
      data: {
        restaurantId,
        fileName,
        status: 'PROCESSING',
        totalRows: wines.length,
        userId,
      },
    });

    let successCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < wines.length; i++) {
      const wine = wines[i];
      try {
        // Map string type to enum
        const wineType = this.mapWineType(wine.type);
        const inventoryStatus = this.mapInventoryStatus(wine.inventoryStatus);

        await prisma.wine.create({
          data: {
            restaurantId,
            name: wine.name,
            producer: wine.producer,
            vintage: wine.vintage,
            region: wine.region,
            country: wine.country,
            grapeVarieties: wine.grapeVarieties || [],
            type: wineType,
            glassPrice: wine.glassPrice,
            bottlePrice: wine.bottlePrice || wine.price,
            tastingNotes: wine.tastingNotes,
            foodPairings: wine.foodPairings || [],
            inventoryStatus,
            importedFrom: fileName,
            importedAt: new Date(),
          },
        });
        successCount++;
      } catch (error) {
        errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    await prisma.wineImport.update({
      where: { id: importRecord.id },
      data: {
        status: errors.length === 0 ? 'COMPLETED' : 'COMPLETED',
        successCount,
        errorCount: errors.length,
        errors: errors.length > 0 ? errors : null,
        completedAt: new Date(),
      },
    });

    return { success: successCount, errors };
  }

  async trackAnalytics(
    wineId: string,
    eventType: 'VIEW' | 'SEARCH' | 'FILTER' | 'CLICK' | 'SHARE',
    metadata?: any,
    sessionId?: string
  ): Promise<void> {
    await prisma.wineAnalytics.create({
      data: {
        wineId,
        eventType,
        metadata,
        sessionId,
      },
    });
  }

  async getPopularWines(restaurantId: string, limit = 10): Promise<Wine[]> {
    const popularWineIds = await prisma.wineAnalytics.groupBy({
      by: ['wineId'],
      where: {
        wine: {
          restaurantId,
          isActive: true,
        },
        eventType: 'VIEW',
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
      _count: {
        wineId: true,
      },
      orderBy: {
        _count: {
          wineId: 'desc',
        },
      },
      take: limit,
    });

    const wines = await prisma.wine.findMany({
      where: {
        id: {
          in: popularWineIds.map(w => w.wineId),
        },
      },
    });

    return wines;
  }

  private mapWineType(type?: string): WineType {
    if (!type) return WineType.OTHER;
    
    const typeMap: Record<string, WineType> = {
      'red': WineType.RED,
      'white': WineType.WHITE,
      'rose': WineType.ROSE,
      'rosé': WineType.ROSE,
      'sparkling': WineType.SPARKLING,
      'dessert': WineType.DESSERT,
      'fortified': WineType.FORTIFIED,
    };

    return typeMap[type.toLowerCase()] || WineType.OTHER;
  }

  private mapInventoryStatus(status?: string): WineInventoryStatus {
    if (!status) return WineInventoryStatus.IN_STOCK;
    
    const statusMap: Record<string, WineInventoryStatus> = {
      'in stock': WineInventoryStatus.IN_STOCK,
      'low stock': WineInventoryStatus.LOW_STOCK,
      'out of stock': WineInventoryStatus.OUT_OF_STOCK,
      'coming soon': WineInventoryStatus.COMING_SOON,
      'seasonal': WineInventoryStatus.SEASONAL,
    };

    return statusMap[status.toLowerCase()] || WineInventoryStatus.IN_STOCK;
  }
}

export const wineService = new WineService();