import dotenv from "dotenv"

dotenv.config()

interface Config {
  isProd: boolean
  PORT: number
  NODE_ENV: string
  FRONTEND_URL: string
  // WHITELIST_ORIGINS: string[]
}

const isProd: boolean = process.env.NODE_ENV === "production"

const config: Config = {
  isProd: isProd,
  PORT: Number(process.env.PORT) || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  // WHITELIST_ORIGINS: [
  //   "http://localhost:3000",
  //   "https://your-production-url.com",
  // ],
}

export default config
