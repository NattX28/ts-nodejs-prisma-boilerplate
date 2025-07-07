export interface User {
  id: number
  email: string
  username: string
  password?: string
  role: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface JWTPayload {
  userId: number
  email: string
  username: string
  role: string
  iat?: number
  exp?: number
}

export interface RefreshTokenPayload {
  userId: number
  tokenId: string
  iat?: number
  exp?: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  username: string
  password: string
}
