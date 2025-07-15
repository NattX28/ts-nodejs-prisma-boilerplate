import express from "express"
import cors from "cors"
import { CorsOptions } from "cors"
import helmet from "helmet"
import compression from "compression"
import cookieParser from "cookie-parser"
// custom modules
import config from "@/configs/env.config"
import limiter from "@/lib/express_rate_limit"
import { errorHandler, notFoundHandler } from "@/middlewares/error.middleware"
// routes import & versioning
import apiV1Routes from "@/routes/v1"
const routeVersion = "v1"

// declare instance of Express
const app = express()

// Middleware setup
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" })) // url-enceoded middleware for form submissions
app.use(cookieParser())
app.use(
  compression({
    threshold: 1024, // Compress responses larger than 1KB
  })
)
app.use(helmet()) // Use Helmet for security headers
app.use(limiter)

// CORS configuration
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!config.isProd || !origin || config.whitelistOrigins.includes(origin)) {
      // Development Mode: Allow all origins or whitelisted origins
      callback(null, true)
    } else {
      // Production Mode: Only allow request from whitelist
      callback(new Error(`CORS ERROR: ${origin} is not allowed`), false)
    }
  },
  credentials: true, // Allow cookie to be sent
}
app.use(cors(corsOptions))

// Routes setup
app.use(`/api/${routeVersion}`, apiV1Routes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app
