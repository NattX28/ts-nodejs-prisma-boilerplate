import { PrismaClient, Role } from "@prisma/client"
import logger from "../../src/configs/logger.config"
import { hashPassword } from "../../src/helpers/password.helper"

export async function seedRoles(prisma: PrismaClient) {
  logger.info("🌱 Seeding roles...")

  // Create admin user
  const adminPassword = await hashPassword("admin123456")
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      username: "admin",
      password: adminPassword,
      role: Role.ADMIN,
      isActive: true,
    },
  })

  const moderatorPassword = await hashPassword("moderator123456")
  const moderator = await prisma.user.upsert({
    where: { email: "moderator@example.com" },
    update: {},
    create: {
      email: "moderator@example.com",
      username: "moderator",
      password: moderatorPassword,
      role: Role.USER,
      isActive: true,
    },
  })

  const userPassword = await hashPassword("user123456")
  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      username: "user",
      password: userPassword,
      role: Role.USER,
      isActive: true,
    },
  })

  logger.info("Create users:")
  logger.info(` - Admin: ${admin.email}`)
  logger.info(` - Moderator: ${moderator.email}`)
  logger.info(` - User: ${user.email}`)
  logger.info("✅ Roles seeded.")
}
