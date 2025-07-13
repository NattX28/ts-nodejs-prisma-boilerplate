import jwt from "jsonwebtoken"
import { jwtConfig } from "@/configs/jwt.config"
import { JWTPayload, RefreshTokenPayload } from "@/types/auth.type"

export const generateAccessToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, jwtConfig.accessTokenSecret, {
    expiresIn: "15m", // 15 minutes
  })
}

export const generateRefreshToken = (payload: RefreshTokenPayload): string => {
  return jwt.sign(payload, jwtConfig.refreshTokenSecret, {
    expiresIn: "30d", // 30 days,
  })
}

export const verifyAccessToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, jwtConfig.accessTokenSecret) as JWTPayload
    return decoded
  } catch (error) {
    return null
  }
}

export const verifyRefreshToken = (
  token: string
): RefreshTokenPayload | null => {
  try {
    const decoded = jwt.verify(
      token,
      jwtConfig.refreshTokenSecret
    ) as RefreshTokenPayload
    return decoded
  } catch (error) {
    return null
  }
}
