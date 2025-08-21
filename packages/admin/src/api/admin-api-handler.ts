import { NextRequest, NextResponse } from 'next/server';
import { createDataManager } from '../services/data-manager';
import { AuditService } from '../audit/audit-service';
import { getServerSession } from 'next-auth';

/**
 * Shared admin API handler for all restaurant apps
 * This provides consistent data management endpoints with automatic audit trails
 */
export class AdminAPIHandler {
  /**
   * Handle menu item operations
   */
  static async handleMenuItem(req: NextRequest, params: { id?: string }) {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const restaurantId = req.headers.get('x-restaurant-id') || '';
    const dataManager = createDataManager({
      userId: session.user.id,
      restaurantId,
      ipAddress: req.ip,
      userAgent: req.headers.get('user-agent') || undefined,
    });

    try {
      switch (req.method) {
        case 'GET':
          if (params.id) {
            const item = await dataManager.getWithHistory('MenuItem', params.id);
            return NextResponse.json(item);
          }
          break;

        case 'POST':
          const createData = await req.json();
          const newItem = await dataManager.createMenuItem(createData);
          return NextResponse.json(newItem, { status: 201 });

        case 'PUT':
        case 'PATCH':
          if (!params.id) {
            return NextResponse.json({ error: 'Item ID required' }, { status: 400 });
          }
          const updateData = await req.json();
          const updatedItem = await dataManager.updateMenuItem(params.id, updateData);
          return NextResponse.json(updatedItem);

        case 'DELETE':
          if (!params.id) {
            return NextResponse.json({ error: 'Item ID required' }, { status: 400 });
          }
          await dataManager.deleteMenuItem(params.id);
          return NextResponse.json({ success: true });

        default:
          return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
      }
    } catch (error) {
      console.error('Menu item operation failed:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Operation failed' },
        { status: 500 }
      );
    }
  }

  /**
   * Handle bulk operations
   */
  static async handleBulkOperations(req: NextRequest) {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const restaurantId = req.headers.get('x-restaurant-id') || '';
    const dataManager = createDataManager({
      userId: session.user.id,
      restaurantId,
      ipAddress: req.ip,
      userAgent: req.headers.get('user-agent') || undefined,
    });

    try {
      const { operation, entityType, items, updates } = await req.json();

      switch (operation) {
        case 'update':
          if (entityType === 'menuItem') {
            const result = await dataManager.bulkUpdateMenuItems(items, updates);
            return NextResponse.json(result);
          }
          break;

        case 'reorder':
          const result = await dataManager.reorderItems(entityType, items);
          return NextResponse.json(result);

        default:
          return NextResponse.json({ error: 'Invalid operation' }, { status: 400 });
      }
    } catch (error) {
      console.error('Bulk operation failed:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Operation failed' },
        { status: 500 }
      );
    }
  }

  /**
   * Handle contact information updates
   */
  static async handleContact(req: NextRequest, params: { id: string }) {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const restaurantId = req.headers.get('x-restaurant-id') || '';
    const dataManager = createDataManager({
      userId: session.user.id,
      restaurantId,
      ipAddress: req.ip,
      userAgent: req.headers.get('user-agent') || undefined,
    });

    try {
      if (req.method === 'PUT' || req.method === 'PATCH') {
        const updates = await req.json();
        const updated = await dataManager.updateContactInfo(params.id, updates);
        return NextResponse.json(updated);
      }
      
      return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
    } catch (error) {
      console.error('Contact update failed:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Operation failed' },
        { status: 500 }
      );
    }
  }

  /**
   * Handle operating hours updates
   */
  static async handleHours(req: NextRequest, params: { id: string }) {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const restaurantId = req.headers.get('x-restaurant-id') || '';
    const dataManager = createDataManager({
      userId: session.user.id,
      restaurantId,
      ipAddress: req.ip,
      userAgent: req.headers.get('user-agent') || undefined,
    });

    try {
      if (req.method === 'PUT' || req.method === 'PATCH') {
        const updates = await req.json();
        const updated = await dataManager.updateOperatingHours(params.id, updates);
        return NextResponse.json(updated);
      }
      
      return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
    } catch (error) {
      console.error('Hours update failed:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Operation failed' },
        { status: 500 }
      );
    }
  }

  /**
   * Handle image operations
   */
  static async handleImage(req: NextRequest, params: { id?: string }) {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const restaurantId = req.headers.get('x-restaurant-id') || '';
    const dataManager = createDataManager({
      userId: session.user.id,
      restaurantId,
      ipAddress: req.ip,
      userAgent: req.headers.get('user-agent') || undefined,
    });

    try {
      switch (req.method) {
        case 'POST':
          const imageData = await req.json();
          const newImage = await dataManager.uploadImage(imageData);
          return NextResponse.json(newImage, { status: 201 });

        case 'DELETE':
          if (!params.id) {
            return NextResponse.json({ error: 'Image ID required' }, { status: 400 });
          }
          await dataManager.deleteImage(params.id);
          return NextResponse.json({ success: true });

        default:
          return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
      }
    } catch (error) {
      console.error('Image operation failed:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Operation failed' },
        { status: 500 }
      );
    }
  }

  /**
   * Handle audit log queries
   */
  static async handleAuditLogs(req: NextRequest) {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to view audit logs
    if (!session.user.permissions?.includes('audit.view')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
      const { searchParams } = new URL(req.url);
      const params: any = {
        restaurantId: searchParams.get('restaurantId') || undefined,
        userId: searchParams.get('userId') || undefined,
        entityType: searchParams.get('entityType') || undefined,
        entityId: searchParams.get('entityId') || undefined,
        action: searchParams.get('action') || undefined,
        limit: parseInt(searchParams.get('limit') || '50'),
        offset: parseInt(searchParams.get('offset') || '0'),
      };

      // Parse date filters
      if (searchParams.get('startDate')) {
        params.startDate = new Date(searchParams.get('startDate')!);
      }
      if (searchParams.get('endDate')) {
        params.endDate = new Date(searchParams.get('endDate')!);
      }

      const logs = await AuditService.getLogs(params);
      return NextResponse.json(logs);
    } catch (error) {
      console.error('Audit log query failed:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Query failed' },
        { status: 500 }
      );
    }
  }

  /**
   * Handle audit report generation
   */
  static async handleAuditReport(req: NextRequest) {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to generate reports
    if (!session.user.permissions?.includes('audit.view')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
      const { restaurantId, startDate, endDate, groupBy } = await req.json();
      
      const report = await AuditService.generateReport({
        restaurantId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        groupBy,
      });

      return NextResponse.json(report);
    } catch (error) {
      console.error('Report generation failed:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Report generation failed' },
        { status: 500 }
      );
    }
  }
}

/**
 * Convenience function to create API route handlers
 */
export function createAdminAPIRoute(
  handler: keyof typeof AdminAPIHandler,
  params?: any
) {
  return async (req: NextRequest) => {
    return AdminAPIHandler[handler](req, params);
  };
}