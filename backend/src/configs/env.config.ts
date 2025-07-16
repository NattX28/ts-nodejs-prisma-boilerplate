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
}

export default config
