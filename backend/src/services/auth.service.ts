import { User } from "@prisma/client"
import prisma from "@/services/prisma.service"
import { AppError } from "@/middlewares/error.middleware"
import { comparePassword } from "@/helpers/password.helper"
import {
  generateAccessToken,
  generateRefreshToken,
  generateTokenId,
} from "@/lib/jwt"
import { LoginRequest } from "@/schemas/auth.schema"
import logger from "@/configs/logger.config"
import { AuthTokens } from "@/types/auth.type"

export const loginUser = async (
  credentials: LoginRequest
): Promise<{
  user: Omit<User, "password">
  tokens: AuthTokens
}> => {
  const { email, password } = credentials

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    throw new AppError("Invalid credentials", 401)
  }

  if (!user.isActive) {
    throw new AppError("Account is deactivated", 401)
  }

  // Verify password
  const isValidPassword = await comparePassword(password, user.password)
  if (!isValidPassword) {
    throw new AppError("Invalid credentials", 401)
  }

  // Generate tokens
  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  })

  const refreshToken = generateRefreshToken({
    userId: user.id,
    tokenId: generateTokenId(),
  })

  // Store refresh token in database
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  })

  // Clean up old refresh token for this user
  await cleanupExpiredTokens(user.id)

  logger.info(`User ${user.email} logged in successfully`)

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    tokens: {
      accessToken,
      refreshToken,
    },
  }
}

export const refreshAccessToken = async (
  refreshToken: string
): Promise<AuthTokens> => {
  // Find refresh token in database
  const tokenRecord = await prisma.refreshToken.findFirst({
    where: { token: refreshToken },
    include: { user: true },
  })

  if (!tokenRecord) {
    throw new AppError("invalid refresh token", 401)
  }

  // Check if token is expired
  if (tokenRecord.expiresAt < new Date()) {
    await prisma.refreshToken.delete({
      where: { id: tokenRecord.id },
    })
    throw new AppError("Refresh token expired", 401)
  }

  // check if user still active
  if (!tokenRecord.user.isActive) {
    throw new AppError("Refresh token expired", 401)
  }

  // Generate new token
  const newAccessToken = generateAccessToken({
    userId: tokenRecord.user.id,
    email: tokenRecord.user.email,
    username: tokenRecord.user.username,
    role: tokenRecord.user.role,
  })

  const newRefreshToken = generateRefreshToken({
    userId: tokenRecord.user.id,
    tokenId: generateTokenId(),
  })

  // Update refresh toekn in database
  await prisma.refreshToken.update({
    where: { id: tokenRecord.id },
    data: {
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  })

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  }
}

export const logoutUser = async (refresToken: string): Promise<void> => {
  // Find and delete refresh token
  const tokenRecord = await prisma.refreshToken.findUnique({
    where: { token: refresToken },
  })

  if (tokenRecord) {
    await prisma.refreshToken.delete({
      where: { id: tokenRecord.id },
    })
    logger.info(`User ${tokenRecord.userId} logged out successfully`)
  }
}

export const logoutAllDevices = async (userId: number): Promise<void> => {
  // Delete all refresh tokens for the user
  await prisma.refreshToken.deleteMany({
    where: { userId },
  })

  logger.info(`All devices logged out for user ${userId}`)
}

const cleanupExpiredTokens = async (userId: number): Promise<void> => {
  await prisma.refreshToken.deleteMany({
    where: {
      userId,
      expiresAt: {
        lt: new Date(),
      },
    },
  })
}

// Cleanup expired tokens periodically
export const cleanupExpiredTokensForAllUser = async (): Promise<void> => {
  const result = await prisma.refreshToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  })

  if (result.count > 0) {
    logger.info(`Cleaned up ${result.count} expired refresh tokens`)
  }
}

// Run cleanup every 24 hours
setInterval(cleanupExpiredTokensForAllUser, 24 * 60 * 60 * 1000)
