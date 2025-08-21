import { prisma } from '@restaurant-platform/database';
import { AuditService, AuditAction } from '../audit/audit-service';
import type { Prisma } from '@prisma/client';

interface DataManagerContext {
  userId: string;
  restaurantId: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Unified data management service with automatic audit trails
 * Used by all restaurant apps for consistent data operations
 */
export class DataManager {
  private context: DataManagerContext;

  constructor(context: DataManagerContext) {
    this.context = context;
  }

  // ============= MENU MANAGEMENT =============

  /**
   * Create a new menu item with audit trail
   */
  async createMenuItem(data: {
    menuId: string;
    sectionId: string;
    name: string;
    description?: string;
    price?: number;
    imageUrl?: string;
    isAvailable?: boolean;
  }) {
    const newItem = await prisma.menuItem.create({
      data: {
        ...data,
        sortOrder: await this.getNextSortOrder('menuItem', data.sectionId),
      },
    });

    await AuditService.record({
      action: AuditAction.MENU_ITEM_ADDED,
      entityType: 'MenuItem',
      entityId: newItem.id,
      restaurantId: this.context.restaurantId,
      userId: this.context.userId,
      newValue: newItem,
      metadata: {
        menuId: data.menuId,
        sectionId: data.sectionId,
      },
      ipAddress: this.context.ipAddress,
      userAgent: this.context.userAgent,
    });

    return newItem;
  }

  /**
   * Update menu item with change tracking
   */
  async updateMenuItem(itemId: string, updates: Partial<{
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    isAvailable: boolean;
    sortOrder: number;
  }>) {
    // Get current state for audit
    const oldItem = await prisma.menuItem.findUnique({
      where: { id: itemId },
    });

    if (!oldItem) {
      throw new Error('Menu item not found');
    }

    // Update the item
    const updatedItem = await prisma.menuItem.update({
      where: { id: itemId },
      data: updates,
    });

    // Record the change
    await AuditService.record({
      action: AuditAction.MENU_ITEM_UPDATED,
      entityType: 'MenuItem',
      entityId: itemId,
      restaurantId: this.context.restaurantId,
      userId: this.context.userId,
      oldValue: oldItem,
      newValue: updatedItem,
      ipAddress: this.context.ipAddress,
      userAgent: this.context.userAgent,
    });

    return updatedItem;
  }

  /**
   * Delete menu item (soft delete with audit)
   */
  async deleteMenuItem(itemId: string) {
    const item = await prisma.menuItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new Error('Menu item not found');
    }

    await prisma.menuItem.delete({
      where: { id: itemId },
    });

    await AuditService.record({
      action: AuditAction.MENU_ITEM_REMOVED,
      entityType: 'MenuItem',
      entityId: itemId,
      restaurantId: this.context.restaurantId,
      userId: this.context.userId,
      oldValue: item,
      ipAddress: this.context.ipAddress,
      userAgent: this.context.userAgent,
    });

    return { success: true };
  }

  /**
   * Bulk update menu items (e.g., marking multiple items out of stock)
   */
  async bulkUpdateMenuItems(
    itemIds: string[],
    updates: Partial<{ isAvailable: boolean; price: number }>
  ) {
    // Get current states
    const oldItems = await prisma.menuItem.findMany({
      where: { id: { in: itemIds } },
    });

    // Perform bulk update
    await prisma.menuItem.updateMany({
      where: { id: { in: itemIds } },
      data: updates,
    });

    // Get new states
    const newItems = await prisma.menuItem.findMany({
      where: { id: { in: itemIds } },
    });

    // Record audit for each item
    for (let i = 0; i < oldItems.length; i++) {
      const oldItem = oldItems[i];
      const newItem = newItems.find(item => item.id === oldItem.id);
      
      if (newItem) {
        await AuditService.record({
          action: updates.isAvailable !== undefined 
            ? AuditAction.MENU_ITEM_STOCK_CHANGED 
            : AuditAction.MENU_ITEM_UPDATED,
          entityType: 'MenuItem',
          entityId: oldItem.id,
          restaurantId: this.context.restaurantId,
          userId: this.context.userId,
          oldValue: oldItem,
          newValue: newItem,
          metadata: {
            bulkOperation: true,
            totalItems: itemIds.length,
          },
          ipAddress: this.context.ipAddress,
          userAgent: this.context.userAgent,
        });
      }
    }

    return { updated: newItems.length };
  }

  // ============= RESTAURANT SETTINGS =============

  /**
   * Update restaurant contact information
   */
  async updateContactInfo(contactId: string, updates: {
    type?: string;
    value?: string;
    label?: string;
  }) {
    const oldContact = await prisma.contact.findUnique({
      where: { id: contactId },
    });

    if (!oldContact) {
      throw new Error('Contact not found');
    }

    const updatedContact = await prisma.contact.update({
      where: { id: contactId },
      data: updates,
    });

    await AuditService.record({
      action: AuditAction.CONTACT_UPDATED,
      entityType: 'Contact',
      entityId: contactId,
      restaurantId: this.context.restaurantId,
      userId: this.context.userId,
      oldValue: oldContact,
      newValue: updatedContact,
      ipAddress: this.context.ipAddress,
      userAgent: this.context.userAgent,
    });

    return updatedContact;
  }

  /**
   * Update operating hours
   */
  async updateOperatingHours(hoursId: string, updates: {
    openTime?: string;
    closeTime?: string;
    isClosed?: boolean;
  }) {
    const oldHours = await prisma.operatingHours.findUnique({
      where: { id: hoursId },
    });

    if (!oldHours) {
      throw new Error('Operating hours not found');
    }

    const updatedHours = await prisma.operatingHours.update({
      where: { id: hoursId },
      data: updates,
    });

    await AuditService.record({
      action: AuditAction.HOURS_UPDATED,
      entityType: 'OperatingHours',
      entityId: hoursId,
      restaurantId: this.context.restaurantId,
      userId: this.context.userId,
      oldValue: oldHours,
      newValue: updatedHours,
      metadata: {
        dayOfWeek: oldHours.dayOfWeek,
      },
      ipAddress: this.context.ipAddress,
      userAgent: this.context.userAgent,
    });

    return updatedHours;
  }

  // ============= MEDIA MANAGEMENT =============

  /**
   * Upload and track image
   */
  async uploadImage(data: {
    url: string;
    alt?: string;
    category?: string;
    sortOrder?: number;
  }) {
    const image = await prisma.image.create({
      data: {
        ...data,
        restaurantId: this.context.restaurantId,
        sortOrder: data.sortOrder || await this.getNextSortOrder('image', this.context.restaurantId),
      },
    });

    await AuditService.record({
      action: AuditAction.IMAGE_UPLOADED,
      entityType: 'Image',
      entityId: image.id,
      restaurantId: this.context.restaurantId,
      userId: this.context.userId,
      newValue: image,
      metadata: {
        category: data.category,
        fileName: data.url.split('/').pop(),
      },
      ipAddress: this.context.ipAddress,
      userAgent: this.context.userAgent,
    });

    return image;
  }

  /**
   * Delete image with tracking
   */
  async deleteImage(imageId: string) {
    const image = await prisma.image.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      throw new Error('Image not found');
    }

    await prisma.image.delete({
      where: { id: imageId },
    });

    await AuditService.record({
      action: AuditAction.IMAGE_DELETED,
      entityType: 'Image',
      entityId: imageId,
      restaurantId: this.context.restaurantId,
      userId: this.context.userId,
      oldValue: image,
      metadata: {
        fileName: image.url.split('/').pop(),
      },
      ipAddress: this.context.ipAddress,
      userAgent: this.context.userAgent,
    });

    return { success: true };
  }

  // ============= CATERING MANAGEMENT =============

  /**
   * Update catering inquiry status
   */
  async updateCateringInquiry(inquiryId: string, updates: {
    status?: 'NEW' | 'CONTACTED' | 'QUOTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
    notes?: string;
    respondedAt?: Date;
  }) {
    const oldInquiry = await prisma.cateringInquiry.findUnique({
      where: { id: inquiryId },
    });

    if (!oldInquiry) {
      throw new Error('Catering inquiry not found');
    }

    const updatedInquiry = await prisma.cateringInquiry.update({
      where: { id: inquiryId },
      data: updates,
    });

    await AuditService.record({
      action: AuditAction.CATERING_INQUIRY_RESPONDED,
      entityType: 'CateringInquiry',
      entityId: inquiryId,
      restaurantId: this.context.restaurantId,
      userId: this.context.userId,
      oldValue: oldInquiry,
      newValue: updatedInquiry,
      metadata: {
        statusChange: `${oldInquiry.status} → ${updatedInquiry.status}`,
      },
      ipAddress: this.context.ipAddress,
      userAgent: this.context.userAgent,
    });

    return updatedInquiry;
  }

  // ============= UTILITY METHODS =============

  /**
   * Get next sort order for orderable entities
   */
  private async getNextSortOrder(entityType: string, parentId: string): Promise<number> {
    let maxOrder = 0;

    switch (entityType) {
      case 'menuItem':
        const items = await prisma.menuItem.findMany({
          where: { sectionId: parentId },
          orderBy: { sortOrder: 'desc' },
          take: 1,
        });
        maxOrder = items[0]?.sortOrder || 0;
        break;

      case 'image':
        const images = await prisma.image.findMany({
          where: { restaurantId: parentId },
          orderBy: { sortOrder: 'desc' },
          take: 1,
        });
        maxOrder = images[0]?.sortOrder || 0;
        break;
    }

    return maxOrder + 10; // Increment by 10 for easy reordering
  }

  /**
   * Reorder items within a category
   */
  async reorderItems(entityType: string, items: { id: string; sortOrder: number }[]) {
    const updates = items.map(item => {
      switch (entityType) {
        case 'menuItem':
          return prisma.menuItem.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
          });
        case 'image':
          return prisma.image.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
          });
        default:
          throw new Error(`Unsupported entity type for reordering: ${entityType}`);
      }
    });

    await prisma.$transaction(updates);

    // Log the reorder action
    await AuditService.record({
      action: AuditAction.UPDATE,
      entityType,
      entityId: 'multiple',
      restaurantId: this.context.restaurantId,
      userId: this.context.userId,
      metadata: {
        operation: 'reorder',
        itemCount: items.length,
        items: items.map(i => i.id),
      },
      ipAddress: this.context.ipAddress,
      userAgent: this.context.userAgent,
    });

    return { success: true };
  }

  /**
   * Get data with version history
   */
  async getWithHistory(entityType: string, entityId: string) {
    // Get current data
    let currentData: any;
    
    switch (entityType) {
      case 'MenuItem':
        currentData = await prisma.menuItem.findUnique({
          where: { id: entityId },
        });
        break;
      case 'Contact':
        currentData = await prisma.contact.findUnique({
          where: { id: entityId },
        });
        break;
      case 'OperatingHours':
        currentData = await prisma.operatingHours.findUnique({
          where: { id: entityId },
        });
        break;
      default:
        throw new Error(`Unsupported entity type: ${entityType}`);
    }

    // Get history from audit logs
    const history = await AuditService.getEntityHistory(entityType, entityId);

    return {
      current: currentData,
      history: history.map(log => ({
        id: log.id,
        action: log.action,
        timestamp: log.timestamp,
        user: log.user,
        changes: log.changes,
        oldValue: log.oldValue,
        newValue: log.newValue,
      })),
      versions: history.length + 1, // +1 for current version
    };
  }
}

/**
 * Factory function to create DataManager with context
 */
export function createDataManager(context: DataManagerContext): DataManager {
  return new DataManager(context);
}