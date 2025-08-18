export * from './services/auth.service';
export * from './utils/password';
export * from './utils/jwt';
export * from './middleware/rbac';

// Re-export types
export type { TokenPayload } from './utils/jwt';
export type { PasswordValidationResult } from './utils/password';
export type { 
  RegisterData, 
  LoginData, 
  AuthResult, 
  SessionValidation 
} from './services/auth.service';