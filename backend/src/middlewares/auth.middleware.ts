import { Request, Response, NextFunction } from "express"
import { verifyAccessToken } from "@/lib/jwt"
import { AppError } from "./error.middleware"
import { getUserById } from "@/services/user.service"
import { Role } from "@prisma/client"

export const authenticateToken = async (
  req: Request,
  _: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(" ")[1] // Bearer TOKEN
    if (!token) {
      throw new AppError("Access token required", 401)
    }

    const payload = verifyAccessToken(token)
    if (!payload) {
      throw new AppError("Invalid or expired token", 401)
    }

    // Get user from database to ensure user still exists and is active
    const user = await getUserById(payload.userId)
    if (!user || !user.isActive) {
      throw new AppError("User not found or inactive", 401)
    }

    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}

export const requireRole = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError("Authentication required", 401)
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError("Insufficient permission", 403)
    }

    next()
  }
}

export const requireAdmin = requireRole([Role.ADMIN])
export const requireModeratorOrAdmin = requireRole([Role.MODERATOR, Role.ADMIN])
