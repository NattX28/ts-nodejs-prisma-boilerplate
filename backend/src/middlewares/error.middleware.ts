import { Request, Response, NextFunction } from "express"
import { ZodError } from "zod"
import logger from "@/configs/logger.config"
import config from "@/configs/env.config"

export interface ApiError extends Error {
  statusCode?: number
  isOperational?: boolean
}

export class AppError extends Error implements ApiError {
  statusCode: number
  isOperational: boolean

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    Error.captureStackTrace(this, this.constructor)
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = { ...err } as ApiError
  error.message = err.message

  // Log error
  logger.error(err.message, {
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  })

  // Zod validation error
  if (err instanceof ZodError) {
    const message = err.issues
      .map((e) => `${e.path.join(".")}: ${e.message}`)
      .join(", ")
    error = new AppError(message, 400)
  }

  // Prisma errors
  if (err.name === "PrismaClientKnownRequestError") {
    const prismaError = err as any
    if (prismaError.code === "P2002") {
      error = new AppError("Resource already exists", 409)
    } else if (prismaError.code === "P2025") {
      error = new AppError("Resource not found", 404)
    }
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error = new AppError("Invalid token", 401)
  }
  if (err.name === "TokenExpiredError") {
    error = new AppError("Token expired", 401)
  }

  // Default error response
  const statusCode = error.statusCode || 500
  const message = error.message || "Internal Server Error"

  res.status(statusCode).json({
    success: false,
    message,
    ...(config.nodeENV === "development" && { stack: err.stack }),
  })
}

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  })
}
