import { Router } from "express"
import {
  getUsers,
  updateProfile,
  deleteAccount,
  adminDeleteUser,
} from "@/controllers/user.controller"
import { authenticateToken, requireAdmin } from "@/middlewares/auth.middleware"
import { validateRequest } from "@/middlewares/validation.middleware"
import { updateProfileSchema } from "@/schemas/auth.schema"

const router = Router()

// All routes require authentication
router.use(authenticateToken)

// User routes
router.put("/profile", validateRequest(updateProfileSchema), updateProfile)
router.delete("/account", deleteAccount)

// Admin routes
router.get("/", requireAdmin, getUsers)
router.delete("/:id", requireAdmin, adminDeleteUser)

export default router
