import { Request, Response } from "express"
import {
  getUserWithPagination,
  updateUser,
  deleteUser,
} from "@/services/user.service"
import asyncHandler from "express-async-handler"
import { UpdateProfileRequest } from "@/schemas/auth.schema"

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10

  const result = await getUserWithPagination(page, limit)

  res.json({
    success: true,
    message: "User retrieved successfully",
    data: result,
  })
})

export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id
    const updateData: UpdateProfileRequest = req.body

    const user = await updateUser(userId, updateData)

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: { user },
    })
  }
)

export const deleteAccount = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id

    await deleteUser(userId)

    res.json({
      success: true,
      message: "Account deleted successfully",
    })
  }
)

export const adminDeleteUser = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id)

    await deleteUser(userId)

    res.json({
      success: true,
      message: "User deleted successfully",
    })
  }
)
