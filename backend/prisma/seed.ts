import { PrismaClient } from "@prisma/client"
import logger from "../src/configs/logger.config"
import config from "../src/configs/env.config"

// import seed modules
import { seedRoles } from "./seeds/roles.seed"

const prisma = new PrismaClient()

async function main() {
  // Safety check - prevent accidental seeding in production
  if (config.nodeENV === "production") {
    logger.warn("⚠️ Seeding is disabled in production environment")
    logger.warn("⚠️ If you really need to seed production, remove this check")
    return
  }

  logger.info("🌱 Starting database seeding...")

  await seedRoles(prisma)

  logger.info("✅ Database seeding completed successfully!")
}

main()
  .catch((error) => {
    logger.error("❌ Error during seeding:", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
