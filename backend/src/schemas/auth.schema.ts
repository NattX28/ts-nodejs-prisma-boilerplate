import { z } from "zod"

export const registerSchema = z.object({
  email: z.email("Invalid email format"),
  username: z
    .string()
    .min(4, "Username must be at least 4 characters")
    .max(20, "Username must be at most 20 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be at most 100 chracters"),
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
})

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .max(100, "New password must be at most 100 characters"),
})

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(4, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .optional(),
  email: z.email("Invalid email format").optional(),
})

// export type inferrence from schemas
export type RegisterRequest = z.infer<typeof registerSchema>
export type LoginRequest = z.infer<typeof loginSchema>
export type RefreshTokenRequest = z.infer<typeof refreshTokenSchema>
export type ChangePasswordRequest = z.infer<typeof changePasswordSchema>
export type UpdateProfileRequest = z.infer<typeof updateProfileSchema>
