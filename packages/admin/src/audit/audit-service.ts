import { prisma } from '@restaurant-platform/database';
import type { Prisma } from '@prisma/client';

export interface AuditLogEntry {
  action: AuditAction;
  entityType: string;
  entityId: string;
  restaurantId: string;
  userId: string;
  oldValue?: any;
  newValue?: any;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export enum AuditAction {
  // Data Operations
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  RESTORE = 'RESTORE',
  
  // Admin Operations
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  INVITE_SENT = 'INVITE_SENT',
  INVITE_ACCEPTED = 'INVITE_ACCEPTED',
  ADMIN_ADDED = 'ADMIN_ADDED',
  ADMIN_REMOVED = 'ADMIN_REMOVED',
  ROLE_CHANGED = 'ROLE_CHANGED',
  
  // Menu Operations
  MENU_CREATED = 'MENU_CREATED',
  MENU_UPDATED = 'MENU_UPDATED',
  MENU_DELETED = 'MENU_DELETED',
  MENU_ITEM_ADDED = 'MENU_ITEM_ADDED',
  MENU_ITEM_UPDATED = 'MENU_ITEM_UPDATED',
  MENU_ITEM_REMOVED = 'MENU_ITEM_REMOVED',
  MENU_ITEM_STOCK_CHANGED = 'MENU_ITEM_STOCK_CHANGED',
  
  // Settings Operations
  HOURS_UPDATED = 'HOURS_UPDATED',
  CONTACT_UPDATED = 'CONTACT_UPDATED',
  SETTINGS_UPDATED = 'SETTINGS_UPDATED',
  
  // Media Operations
  IMAGE_UPLOADED = 'IMAGE_UPLOADED',
  IMAGE_DELETED = 'IMAGE_DELETED',
  IMAGE_UPDATED = 'IMAGE_UPDATED',
  
  // Catering Operations
  CATERING_INQUIRY_RECEIVED = 'CATERING_INQUIRY_RECEIVED',
  CATERING_INQUIRY_RESPONDED = 'CATERING_INQUIRY_RESPONDED',
  CATERING_INQUIRY_COMPLETED = 'CATERING_INQUIRY_COMPLETED',
}

export class AuditService {
  /**
   * Record an audit log entry
   */
  static async record(entry: AuditLogEntry): Promise<void> {
    try {
      // Calculate what changed if both old and new values provided
      const changes = entry.oldValue && entry.newValue
        ? this.calculateChanges(entry.oldValue, entry.newValue)
        : null;

      await prisma.auditLog.create({
        data: {
          action: entry.action,
          entityType: entry.entityType,
          entityId: entry.entityId,
          restaurantId: entry.restaurantId,
          userId: entry.userId,
          oldValue: entry.oldValue ? JSON.stringify(entry.oldValue) : null,
          newValue: entry.newValue ? JSON.stringify(entry.newValue) : null,
          changes: changes ? JSON.stringify(changes) : null,
          metadata: entry.metadata ? JSON.stringify(entry.metadata) : null,
          ipAddress: entry.ipAddress,
          userAgent: entry.userAgent,
          timestamp: new Date(),
        },
      });
    } catch (error) {
      console.error('Failed to record audit log:', error);
      // Don't throw - audit logging should not break the main operation
    }
  }

  /**
   * Get audit logs with filtering
   */
  static async getLogs(params: {
    restaurantId?: string;
    userId?: string;
    entityType?: string;
    entityId?: string;
    action?: AuditAction;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }) {
    const where: Prisma.AuditLogWhereInput = {};

    if (params.restaurantId) where.restaurantId = params.restaurantId;
    if (params.userId) where.userId = params.userId;
    if (params.entityType) where.entityType = params.entityType;
    if (params.entityId) where.entityId = params.entityId;
    if (params.action) where.action = params.action;
    
    if (params.startDate || params.endDate) {
      where.timestamp = {};
      if (params.startDate) where.timestamp.gte = params.startDate;
      if (params.endDate) where.timestamp.lte = params.endDate;
    }

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: params.limit || 50,
      skip: params.offset || 0,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return logs.map(log => ({
      ...log,
      oldValue: log.oldValue ? JSON.parse(log.oldValue as string) : null,
      newValue: log.newValue ? JSON.parse(log.newValue as string) : null,
      changes: log.changes ? JSON.parse(log.changes as string) : null,
      metadata: log.metadata ? JSON.parse(log.metadata as string) : null,
    }));
  }

  /**
   * Get entity history
   */
  static async getEntityHistory(entityType: string, entityId: string) {
    return this.getLogs({ entityType, entityId });
  }

  /**
   * Get user activity
   */
  static async getUserActivity(userId: string, limit = 50) {
    return this.getLogs({ userId, limit });
  }

  /**
   * Calculate what fields changed between old and new values
   */
  private static calculateChanges(oldValue: any, newValue: any): Record<string, any> {
    const changes: Record<string, any> = {};
    
    // Get all keys from both objects
    const allKeys = new Set([
      ...Object.keys(oldValue || {}),
      ...Object.keys(newValue || {}),
    ]);

    for (const key of allKeys) {
      const oldVal = oldValue?.[key];
      const newVal = newValue?.[key];
      
      // Skip if values are the same
      if (JSON.stringify(oldVal) === JSON.stringify(newVal)) {
        continue;
      }
      
      changes[key] = {
        from: oldVal,
        to: newVal,
      };
    }

    return changes;
  }

  /**
   * Rollback to a previous state (for critical operations)
   */
  static async rollback(auditLogId: string): Promise<boolean> {
    const log = await prisma.auditLog.findUnique({
      where: { id: auditLogId },
    });

    if (!log || !log.oldValue) {
      return false;
    }

    // This would need to be implemented based on entity type
    // For now, we just record the rollback action
    await this.record({
      action: AuditAction.RESTORE,
      entityType: log.entityType,
      entityId: log.entityId,
      restaurantId: log.restaurantId,
      userId: log.userId,
      oldValue: log.newValue ? JSON.parse(log.newValue as string) : null,
      newValue: log.oldValue ? JSON.parse(log.oldValue as string) : null,
      metadata: {
        rolledBackFromLogId: auditLogId,
      },
    });

    return true;
  }

  /**
   * Generate audit report
   */
  static async generateReport(params: {
    restaurantId: string;
    startDate: Date;
    endDate: Date;
    groupBy?: 'user' | 'action' | 'entityType';
  }) {
    const logs = await this.getLogs({
      restaurantId: params.restaurantId,
      startDate: params.startDate,
      endDate: params.endDate,
      limit: 10000, // Get all logs in date range
    });

    // Group logs as requested
    if (params.groupBy) {
      const grouped = logs.reduce((acc, log) => {
        const key = log[params.groupBy] || 'unknown';
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(log);
        return acc;
      }, {} as Record<string, typeof logs>);

      return {
        summary: {
          totalActions: logs.length,
          uniqueUsers: new Set(logs.map(l => l.userId)).size,
          dateRange: {
            from: params.startDate,
            to: params.endDate,
          },
        },
        grouped,
      };
    }

    return {
      summary: {
        totalActions: logs.length,
        uniqueUsers: new Set(logs.map(l => l.userId)).size,
        dateRange: {
          from: params.startDate,
          to: params.endDate,
        },
      },
      logs,
    };
  }
}

// Export singleton instance for convenience
export const auditLog = AuditService;