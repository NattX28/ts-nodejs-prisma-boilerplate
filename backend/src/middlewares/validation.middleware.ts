import { Request, Response, NextFunction } from "express"
import { ZodType } from "zod"
import asyncHandler from "express-async-handler"

export const validateRequest = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
      next(error)
    }
  }
}

export const validateParams = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params)
      next()
    } catch (error) {
      next(error)
    }
  }
}

export const validateQuery = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query)
    } catch (error) {
      next(error)
    }
  }
}
