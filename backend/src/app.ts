import express from "express"
import cors from "cors"
import { CorsOptions } from "cors"
import helmet from "helmet"
import compression from "compression"
// custom modules
import config from "@/configs/env.config"
import limiter from "@/lib/express_rate_limit"
// routes import & versioning
import apiV1Routes from "@/routes/v1"
const routeVersion = "v1"

// declare instance of Express
const app = express()

// Middleware setup
app.use(express.json())
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
}
app.use(cors(corsOptions))

// Routes setup
app.use(`/api/${routeVersion}`, apiV1Routes)

export default app
