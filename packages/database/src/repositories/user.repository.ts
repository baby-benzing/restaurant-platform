import { BaseRepository } from './base.repository';
import type { User, Prisma, PrismaClient } from '@prisma/client';
import { RecordNotFoundError, UniqueConstraintError } from '../utils/errors';
import { hash, compare } from 'bcryptjs';

export type SafeUser = Omit<User, 'passwordHash'>;

export class UserRepository extends BaseRepository<User> {
  constructor(private prisma: PrismaClient) {
    super(prisma.user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.model.findUnique({
      where: { email },
    });
  }

  async findSafeById(id: string): Promise<SafeUser | null> {
    const user = await this.findById(id);
    if (!user) return null;
    
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async findAllSafe(): Promise<SafeUser[]> {
    const users = await this.findAll();
    return users.map(({ passwordHash, ...user }) => user);
  }

  async createUser(data: {
    email: string;
    password: string;
    name?: string;
    role?: string;
  }): Promise<SafeUser> {
    const exists = await this.findByEmail(data.email);
    if (exists) {
      throw new UniqueConstraintError('email', data.email);
    }

    const passwordHash = await hash(data.password, 10);
    
    const user = await this.create({
      email: data.email,
      passwordHash,
      name: data.name,
      role: data.role || 'viewer',
    });

    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const passwordHash = await hash(newPassword, 10);
    
    await this.update(userId, { passwordHash });
  }

  async verifyPassword(email: string, password: string): Promise<SafeUser | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;

    const isValid = await compare(password, user.passwordHash);
    if (!isValid) return null;

    // Update last login
    await this.update(user.id, {
      lastLoginAt: new Date(),
    });

    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async toggleUserStatus(userId: string): Promise<SafeUser> {
    const user = await this.findById(userId);
    if (!user) {
      throw new RecordNotFoundError('User', userId);
    }

    const updated = await this.update(userId, {
      isActive: !user.isActive,
    });

    const { passwordHash, ...safeUser } = updated;
    return safeUser;
  }

  async updateRole(userId: string, role: string): Promise<SafeUser> {
    const user = await this.findById(userId);
    if (!user) {
      throw new RecordNotFoundError('User', userId);
    }

    const updated = await this.update(userId, { role });
    
    const { passwordHash, ...safeUser } = updated;
    return safeUser;
  }

  async getActiveUsers(): Promise<SafeUser[]> {
    const users = await this.model.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    return users.map(({ passwordHash, ...user }) => user);
  }

  async getUsersByRole(role: string): Promise<SafeUser[]> {
    const users = await this.model.findMany({
      where: { role },
      orderBy: { name: 'asc' },
    });

    return users.map(({ passwordHash, ...user }) => user);
  }
}