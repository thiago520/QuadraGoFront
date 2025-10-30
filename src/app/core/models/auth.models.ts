// auth.model.ts

/** --------- AUTH REQUESTS --------- */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

/** --------- AUTH RESPONSES --------- */
/**
 * Resposta padrão do backend para /auth/login e /auth/refresh
 * (contém também os metadados do usuário autenticado).
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  userId: number;
  email: string;
  roles: string[];
}

/** Mantido para conveniência no app (não é retornado no login). */
export interface UserSummary {
  id: number;
  email: string;
  name?: string;
  roles: string[];
}

/** --------- JWT (opcional, caso decodifique no front) --------- */
export interface JwtPayload {
  sub: string;
  exp: number; // epoch seconds
  iat?: number;
  roles?: string[];
  [k: string]: unknown;
}

/** --------- PADRÃO DE ERRO DO BACKEND --------- */
export interface FieldError {
  field: string;
  message: string;
  rejectedValue?: unknown;
}

export interface ApiError {
  timestamp: string; // ISO
  status: number;
  error: string;
  message: string;
  path: string;
  details?: {
    fields?: FieldError[];
  };
}
