import { PrismaClient, Role } from "@prisma/client"
import logger from "../src/configs/logger.config"

// import seed modules
import { seedRoles } from "./seeds/roles.seed"

const prisma = new PrismaClient()

async function main() {
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
