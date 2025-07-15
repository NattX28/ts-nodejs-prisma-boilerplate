import { Router } from "express"
import { Response } from "express"
import authRoutes from "@/routes/v1/auth.route"
import userRoutes from "@/routes/v1/user.route"

const router = Router()

router.get("/health", (_, res: Response) => {
  try {
    res.status(200).json({
      status: "OK",
      message: "Server is healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
    })
  } catch (error) {
    res.status(503).json({
      status: "ERROR",
      message: "Server is not healthy",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    })
  }
})

// API routes
router.use("/auth", authRoutes)
router.use("/user", userRoutes)

export default router
