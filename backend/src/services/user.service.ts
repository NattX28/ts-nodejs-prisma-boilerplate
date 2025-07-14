import { User, Role } from "@prisma/client"
import prisma from "@/services/prisma.service"
import { AppError } from "@/middlewares/error.middleware"
import { hashPassword, comparePassword } from "@/helpers/password.helper"
import { RegisterRequest, UpdateProfileRequest } from "@/schemas/auth.schema"

export const createUser = async (
  userData: RegisterRequest
): Promise<Omit<User, "password">> => {
  const { email, username, password } = userData

  // Check if user already exists
  let existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  })

  if (existingUser) {
    throw new AppError("User with this email or username already exists", 409)
  }

  const hashedPassword: string = await hashPassword(password)

  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return user
}

export const getUserById = async (
  id: number
): Promise<Omit<User, "password"> | null> => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { email },
  })
}

export const getUserByUsername = async (
  username: string
): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { username },
  })
}

export const updateUser = async (
  id: number,
  userData: UpdateProfileRequest
): Promise<Omit<User, "password">> => {
  const { email, username } = userData

  // check if or username is already taken by another user
  if (email || username) {
    const existingUser = await prisma.user.findFirst({
      where: {
        AND: [
          { id: { not: id } },
          {
            OR: [
              ...(email ? [{ email }] : []),
              ...(username ? [{ username }] : []),
            ],
          },
        ],
      },
    })
    if (existingUser) {
      throw new AppError("Email or username already taken", 409)
    }
  }

  const user = await prisma.user.update({
    where: { id },
    data: userData,
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return user
}

export const changePassword = async (
  id: number,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  const user = await prisma.user.findFirst({
    where: { id },
  })

  if (!user) {
    throw new AppError("User not found", 404)
  }

  const isValidPassword = await comparePassword(currentPassword, user.password)
  if (!isValidPassword) {
    throw new AppError("Current password is incorrect", 400)
  }

  const hashedNewPassword = await hashPassword(newPassword)
  await prisma.user.update({
    where: { id },
    data: { password: hashedNewPassword },
  })
}

export const deleteUser = async (id: number): Promise<void> => {
  await prisma.user.delete({
    where: { id },
  })
}

export const getUserWithPagination = async (
  page: number = 1,
  limit: number = 10
) => {
  const offset = (page - 1) * limit

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip: offset,
      take: limit,
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count(),
  ])

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}
