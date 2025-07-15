import { Request, Response } from "express"
import { createUser, changePassword } from "@/services/user.service"
import {
  loginUser,
  refreshAccessToken,
  logoutUser,
  logoutAllDevices,
} from "@/services/auth.service"
import config from "@/configs/env.config"
import asyncHandler from "express-async-handler"
import {
  RegisterRequest,
  LoginRequest,
  RefreshTokenRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
} from "@/schemas/auth.schema"

export const register = asyncHandler(async (req: Request, res: Response) => {
  const userData: RegisterRequest = req.body

  const user = await createUser(userData)

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: { user },
  })
})

export const login = asyncHandler(async (req: Request, res: Response) => {
  const credentials: LoginRequest = req.body

  const { user, tokens } = await loginUser(credentials)

  // Set refresh token as httpOnly cookie
  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: config.nodeENV === "production",
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  })

  res.json({
    success: true,
    message: "Login successful",
    data: {
      user,
      accessToken: tokens.accessToken,
    },
  })
})

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        message: "refresh token not found",
      })
      return
    }

    const tokens = await refreshAccessToken(refreshToken)

    // Set new refresh token as httpOnly cokkie
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: config.nodeENV === "production",
      sameSite: "none",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })

    res.json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        accessToken: tokens.accessToken,
      },
    })
  }
)

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken

  if (refreshToken) {
    await logoutUser(refreshToken)
  }

  res.clearCookie("refreshToken")

  res.json({
    success: true,
    message: "Logged out successfully",
  })
})

export const logoutAll = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id

  await logoutAllDevices(userId)
  res.clearCookie("refreshToken")

  res.json({
    success: true,
    message: "Logged out from all devices successfully",
  })
})

export const changeUserPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id
    const { currentPassword, newPassword }: ChangePasswordRequest = req.body

    await changePassword(userId, currentPassword, newPassword)

    res.json({
      success: true,
      message: "Password changed successfully",
    })
  }
)

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "User profile retrieved successfully",
    data: { user: req.user },
  })
})
