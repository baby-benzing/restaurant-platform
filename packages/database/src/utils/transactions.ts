import { prisma } from '../client';
import type { PrismaClient } from '@prisma/client';
import { handlePrismaError } from './errors';

export type TransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
>;

export async function withTransaction<T>(
  fn: (tx: TransactionClient) => Promise<T>
): Promise<T> {
  try {
    return await prisma.$transaction(async (tx) => {
      return await fn(tx);
    });
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function runInTransaction<T>(
  operations: ((tx: TransactionClient) => Promise<any>)[]
): Promise<T[]> {
  try {
    return await prisma.$transaction(async (tx) => {
      const results = [];
      for (const operation of operations) {
        const result = await operation(tx);
        results.push(result);
      }
      return results;
    });
  } catch (error) {
    handlePrismaError(error);
  }
}

export async function retryTransaction<T>(
  fn: (tx: TransactionClient) => Promise<T>,
  maxRetries = 3,
  delayMs = 100
): Promise<T> {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await withTransaction(fn);
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on validation errors
      if (error.code === 'VALIDATION_ERROR' || error.code === 'UNIQUE_CONSTRAINT') {
        throw error;
      }
      
      // Wait before retrying
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs * (i + 1)));
      }
    }
  }
  
  throw lastError;
}