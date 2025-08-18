export class DatabaseError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class RecordNotFoundError extends DatabaseError {
  constructor(entity: string, id?: string) {
    const message = id 
      ? `${entity} with id ${id} not found`
      : `${entity} not found`;
    super(message, 'RECORD_NOT_FOUND');
    this.name = 'RecordNotFoundError';
  }
}

export class ValidationError extends DatabaseError {
  constructor(
    message: string,
    public readonly fields?: Record<string, string>
  ) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class UniqueConstraintError extends DatabaseError {
  constructor(field: string, value?: string) {
    const message = value
      ? `${field} '${value}' already exists`
      : `${field} must be unique`;
    super(message, 'UNIQUE_CONSTRAINT');
    this.name = 'UniqueConstraintError';
  }
}

export class ConnectionError extends DatabaseError {
  constructor(message = 'Failed to connect to database') {
    super(message, 'CONNECTION_ERROR');
    this.name = 'ConnectionError';
  }
}

export function handlePrismaError(error: any): never {
  if (error.code === 'P2002') {
    const field = error.meta?.target?.[0] || 'field';
    throw new UniqueConstraintError(field);
  }
  
  if (error.code === 'P2025') {
    throw new RecordNotFoundError('Record');
  }
  
  if (error.code === 'P2003') {
    throw new ValidationError('Foreign key constraint failed');
  }
  
  if (error.code === 'P1001' || error.code === 'P1002') {
    throw new ConnectionError();
  }
  
  throw new DatabaseError(
    error.message || 'An unexpected database error occurred',
    error.code,
    error
  );
}