import { PrismaClient, Role } from "@prisma/client"
import logger from "../../src/configs/logger.config"
import { hashPassword } from "../../src/helpers/password.helper"
import config from "../../src/configs/env.config"

export async function seedRoles(prisma: PrismaClient) {
  logger.info("🌱 Seeding roles...")

  // Create admin user
  const adminPassword = await hashPassword(config.adminPassword)
  const admin = await prisma.user.upsert({
    where: { email: config.adminEmail },
    update: {},
    create: {
      email: config.adminEmail,
      username: "admin",
      password: adminPassword,
      role: Role.ADMIN,
      isActive: true,
    },
  })

  const moderatorPassword = await hashPassword(config.moderatorPassword)
  const moderator = await prisma.user.upsert({
    where: { email: config.moderatorEmail },
    update: {},
    create: {
      email: config.moderatorEmail,
      username: "moderator",
      password: moderatorPassword,
      role: Role.MODERATOR,
      isActive: true,
    },
  })

  const userPassword = await hashPassword(config.userPassword)
  const user = await prisma.user.upsert({
    where: { email: config.userEmail },
    update: {},
    create: {
      email: config.userEmail,
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
