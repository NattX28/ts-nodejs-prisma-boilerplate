import dotenv from "dotenv"

dotenv.config()

interface Config {
  isProd: boolean
  port: number
  nodeENV: string
  frontendURL: string
  whitelistOrigins: string[]
  accessTokenSecret: string
  refreshTokenSecret: string
  accessTokenExpiry: string
  refreshToken: string
  databaseURL: string
  adminEmail: string
  adminPassword: string
  moderatorEmail: string
  moderatorPassword: string
  userEmail: string
  userPassword: string
}

const isProd: boolean = process.env.NODE_ENV === "production"

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set.")
  process.exit(1)
}

const config: Config = {
  isProd: isProd,
  port: Number(process.env.PORT) || 5000,
  nodeENV: process.env.NODE_ENV || "development",
  frontendURL: process.env.FRONTEND_URL || "http://localhost:3000",
  whitelistOrigins: [
    "http://localhost:3000",
    "https://your-production-url.com",
  ],
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || "myjwtaccesssecret1",
  refreshTokenSecret:
    process.env.REFRESH_TOKEN_SECRET || "myjwtrefreshtokensecret1",

  accessTokenExpiry: "15m",
  refreshToken: "30d",
  databaseURL: process.env.DATABASE_URL,
  // seed env
  adminEmail: process.env.ADMIN_EMAIL || "admin@example.com",
  adminPassword: process.env.ADMIN_PASSWORD || "admin123456",
  moderatorEmail: process.env.MODERATOR_EMAIL || "moderator@example.com",
  moderatorPassword: process.env.MODERATOR_PASSWORD || "moderator123456",
  userEmail: process.env.USER_EMAIL || "user@example.com",
  userPassword: process.env.USER_PASSWORD || "user123456",
}

export default config
