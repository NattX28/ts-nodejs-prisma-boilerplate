import { Router } from "express"
import {
  register,
  login,
  refreshToken,
  logout,
  logoutAll,
  changeUserPassword,
  getMe,
} from "@/controllers/auth.controller"
import { authenticateToken } from "@/middlewares/auth.middleware"
import { validateRequest } from "@/middlewares/validation.middleware"
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
} from "@/schemas/auth.schema"

const router = Router()

// Public routes
router.post("/register", validateRequest(registerSchema), register)
router.post("/login", validateRequest(loginSchema), login)
router.post("/refresh", refreshToken)

// Protected routes
router.post("logout", logout)
router.post("/logout-all", authenticateToken, logoutAll)
router.post("/me", authenticateToken, getMe)
router.post(
  "/change-password",
  authenticateToken,
  validateRequest(changePasswordSchema),
  changeUserPassword
)

export default router
