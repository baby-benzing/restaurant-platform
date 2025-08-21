import { prisma } from '@restaurant-platform/database';
import { UserRole, canInviteUsers, canRemoveUsers, canAssignRole } from '../auth/rbac';
import { AuditService, AuditAction } from '../audit/audit-service';
import * as crypto from 'crypto';

export interface InviteUserParams {
  email: string;
  role: UserRole;
  restaurantIds: string[];
  invitedBy: string; // User ID of the inviter
}

export interface UserWithRole {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  lastLoginAt?: Date;
  createdAt: Date;
  restaurants: Array<{
    id: string;
    name: string;
  }>;
}

export class UserManagementService {
  /**
   * Invite a new user to the platform
   * Only admins can invite users
   */
  static async inviteUser(
    inviterRole: UserRole,
    params: InviteUserParams
  ): Promise<{ success: boolean; message: string; invitationUrl?: string }> {
    // Check if inviter has permission to invite
    if (!canInviteUsers(inviterRole)) {
      return {
        success: false,
        message: 'You do not have permission to invite users. Only administrators can invite users.',
      };
    }

    // Check if inviter can assign the target role
    if (!canAssignRole(inviterRole, params.role)) {
      return {
        success: false,
        message: `You cannot assign the ${params.role} role.`,
      };
    }

    try {
      // Check if user already exists
      const existingUser = await prisma.adminUser.findUnique({
        where: { email: params.email },
      });

      if (existingUser) {
        return {
          success: false,
          message: 'A user with this email already exists.',
        };
      }

      // Check if there's a pending invitation
      const existingInvitation = await prisma.invitation.findFirst({
        where: {
          email: params.email,
          status: 'PENDING',
          expiresAt: { gt: new Date() },
        },
      });

      if (existingInvitation) {
        return {
          success: false,
          message: 'An invitation has already been sent to this email.',
        };
      }

      // Create invitation token
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

      // Get or create the role
      let roleRecord = await prisma.adminRole.findUnique({
        where: { name: params.role },
      });

      if (!roleRecord) {
        // Create the role if it doesn't exist
        roleRecord = await prisma.adminRole.create({
          data: {
            name: params.role,
            description: params.role === UserRole.ADMIN 
              ? 'Full system administrator with user management'
              : 'Content editor with data management permissions',
            permissions: params.role === UserRole.ADMIN
              ? ['user.invite', 'user.remove', 'user.view', 'data.edit', 'audit.view']
              : ['data.edit', 'audit.view'],
            isSystem: true,
          },
        });
      }

      // Create invitation
      const invitation = await prisma.invitation.create({
        data: {
          email: params.email,
          roleId: roleRecord.id,
          invitedById: params.invitedBy,
          token,
          expiresAt,
          status: 'PENDING',
        },
      });

      // Record audit log
      await AuditService.record({
        action: AuditAction.USER_INVITED,
        entityType: 'Invitation',
        entityId: invitation.id,
        restaurantId: params.restaurantIds[0], // Primary restaurant
        userId: params.invitedBy,
        newValue: {
          email: params.email,
          role: params.role,
          restaurants: params.restaurantIds,
        },
        metadata: {
          invitationToken: token,
          expiresAt,
        },
      });

      // Generate invitation URL
      const invitationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/admin/auth/accept-invitation?token=${token}`;

      return {
        success: true,
        message: `Invitation sent to ${params.email}`,
        invitationUrl,
      };
    } catch (error) {
      console.error('Failed to invite user:', error);
      return {
        success: false,
        message: 'Failed to send invitation. Please try again.',
      };
    }
  }

  /**
   * Remove a user from the platform
   * Only admins can remove users
   */
  static async removeUser(
    removerRole: UserRole,
    removerId: string,
    targetUserId: string
  ): Promise<{ success: boolean; message: string }> {
    // Check if remover has permission
    if (!canRemoveUsers(removerRole)) {
      return {
        success: false,
        message: 'You do not have permission to remove users. Only administrators can remove users.',
      };
    }

    // Prevent self-removal
    if (removerId === targetUserId) {
      return {
        success: false,
        message: 'You cannot remove your own account.',
      };
    }

    try {
      // Get target user details for audit
      const targetUser = await prisma.adminUser.findUnique({
        where: { id: targetUserId },
        include: {
          role: true,
          restaurants: {
            include: {
              restaurant: true,
            },
          },
        },
      });

      if (!targetUser) {
        return {
          success: false,
          message: 'User not found.',
        };
      }

      // Prevent removing the last admin
      if (targetUser.role.name === UserRole.ADMIN) {
        const adminCount = await prisma.adminUser.count({
          where: {
            role: {
              name: UserRole.ADMIN,
            },
            status: 'ACTIVE',
          },
        });

        if (adminCount <= 1) {
          return {
            success: false,
            message: 'Cannot remove the last administrator.',
          };
        }
      }

      // Soft delete - set status to SUSPENDED
      const updatedUser = await prisma.adminUser.update({
        where: { id: targetUserId },
        data: {
          status: 'SUSPENDED',
        },
      });

      // Invalidate all sessions for this user
      await prisma.session.deleteMany({
        where: { userId: targetUserId },
      });

      // Record audit log
      await AuditService.record({
        action: AuditAction.USER_REMOVED,
        entityType: 'AdminUser',
        entityId: targetUserId,
        restaurantId: targetUser.restaurants[0]?.restaurantId,
        userId: removerId,
        oldValue: {
          status: targetUser.status,
          role: targetUser.role.name,
        },
        newValue: {
          status: 'SUSPENDED',
        },
        metadata: {
          removedUserEmail: targetUser.email,
          removedUserRole: targetUser.role.name,
        },
      });

      return {
        success: true,
        message: `User ${targetUser.email} has been removed.`,
      };
    } catch (error) {
      console.error('Failed to remove user:', error);
      return {
        success: false,
        message: 'Failed to remove user. Please try again.',
      };
    }
  }

  /**
   * List all users (with role-based filtering)
   */
  static async listUsers(
    viewerRole: UserRole,
    restaurantId?: string
  ): Promise<UserWithRole[]> {
    try {
      const users = await prisma.adminUser.findMany({
        where: {
          status: { not: 'SUSPENDED' },
          ...(restaurantId && {
            restaurants: {
              some: {
                restaurantId,
              },
            },
          }),
        },
        include: {
          role: true,
          restaurants: {
            include: {
              restaurant: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name || undefined,
        role: user.role.name as UserRole,
        status: user.status as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED',
        lastLoginAt: user.lastLoginAt || undefined,
        createdAt: user.createdAt,
        restaurants: user.restaurants.map(r => ({
          id: r.restaurant.id,
          name: r.restaurant.name,
        })),
      }));
    } catch (error) {
      console.error('Failed to list users:', error);
      return [];
    }
  }

  /**
   * Update user role (admin only)
   */
  static async updateUserRole(
    updaterRole: UserRole,
    updaterId: string,
    targetUserId: string,
    newRole: UserRole
  ): Promise<{ success: boolean; message: string }> {
    // Only admins can change roles
    if (updaterRole !== UserRole.ADMIN) {
      return {
        success: false,
        message: 'Only administrators can change user roles.',
      };
    }

    // Prevent self-demotion
    if (updaterId === targetUserId && newRole !== UserRole.ADMIN) {
      return {
        success: false,
        message: 'You cannot demote yourself from administrator.',
      };
    }

    try {
      // Get the new role record
      const roleRecord = await prisma.adminRole.findUnique({
        where: { name: newRole },
      });

      if (!roleRecord) {
        return {
          success: false,
          message: 'Invalid role specified.',
        };
      }

      // Get current user for audit
      const currentUser = await prisma.adminUser.findUnique({
        where: { id: targetUserId },
        include: { role: true },
      });

      if (!currentUser) {
        return {
          success: false,
          message: 'User not found.',
        };
      }

      // Update user role
      const updatedUser = await prisma.adminUser.update({
        where: { id: targetUserId },
        data: {
          roleId: roleRecord.id,
        },
      });

      // Record audit log
      await AuditService.record({
        action: AuditAction.USER_ROLE_CHANGED,
        entityType: 'AdminUser',
        entityId: targetUserId,
        userId: updaterId,
        oldValue: {
          role: currentUser.role.name,
        },
        newValue: {
          role: newRole,
        },
        metadata: {
          targetUserEmail: currentUser.email,
        },
      });

      return {
        success: true,
        message: `User role updated to ${newRole}.`,
      };
    } catch (error) {
      console.error('Failed to update user role:', error);
      return {
        success: false,
        message: 'Failed to update user role. Please try again.',
      };
    }
  }
}