import { Router } from "express"
import { Response } from "express"
import prisma from "@/services/prisma.service"
import authRoutes from "@/routes/v1/auth.route"
import userRoutes from "@/routes/v1/user.route"
import config from "@/configs/env.config"

const router = Router()

router.get("/health", async (_, res: Response) => {
  try {
    // Ping database
    await prisma.$queryRaw`SELECT 1`

    res.status(200).json({
      status: "OK",
      message: "Server is healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.nodeENV || "development",
      database: "connected",
    })
  } catch (error) {
    res.status(503).json({
      status: "ERROR",
      message: "Server is not healthy",
      timestamp: new Date().toISOString(),
      environment: config.nodeENV || "development",
      database: "unreachable",
    })
  }
})

// API routes
router.use("/auth", authRoutes)
router.use("/user", userRoutes)

export default router
