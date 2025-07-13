import config from "@/configs/env.config"

interface JWTConfig {
  accessTokenSecret: string
  refreshTokenSecret: string
  accessTokenExpiry: string | number
  refreshTokenExpiry: string | number
}

export const jwtConfig: JWTConfig = {
  accessTokenSecret: config.accessTokenSecret,
  refreshTokenSecret: config.refreshTokenSecret,
  accessTokenExpiry: "15m",
  refreshTokenExpiry: "30d",
}
