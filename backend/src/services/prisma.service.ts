import { PrismaClient } from "@prisma/client"
import logger from "@/configs/logger.config"
import config from "@/configs/env.config"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      config.nodeENV === "development" ? ["query", "error", "warn"] : ["error"],
  })

if (config.nodeENV !== "production") {
  globalForPrisma.prisma = prisma
}

// Graceful shutdown
process.on("beforeExit", async () => {
  logger.info("Disconnecting from database...")
  await prisma.$disconnect()
})

process.on("SIGINT", async () => {
  logger.info("Recieved SIGINT, disconnecting from database...")
  await prisma.$disconnect()
  process.exit(0)
})

process.on("SIGTERM", async () => {
  logger.info("Recieved SIGTERM, disconnecting from database...")
  await prisma.$disconnect()
  process.exit(0)
})

export default prisma
