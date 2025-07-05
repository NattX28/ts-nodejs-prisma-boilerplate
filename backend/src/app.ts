import express from "express"
import { readdirSync } from "fs"
import path from "path"
import cors from "cors"
import { CorsOptions } from "cors"
import helmet from "helmet"
import compression from "compression"
import config from "./configs/env"

// Load env

// declare instance of Express
const app = express()

app.use(express.json())
app.use(helmet())
app.use(
  compression({
    threshold: 1024, // Compress responses larger than 1KB
  })
)

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      !config.isProd ||
      !origin
      //   config.WHITELIST_ORIGINS.includes(origin)
    ) {
      // Development Mode: Allow all origins or whitelisted origins
      callback(null, true)
    } else {
      // Production Mode: Only allow request from whilelist
      callback(new Error(`CORS ERROR: ${origin} is not allowed`), false)
    }
  },
}

app.use(cors(corsOptions))

if (config.isProd) {
  console.log("Running in production mode")
} else {
  console.log("Running in development mode")
}

app.get("/", (req, res) => {
  console.log("Hello this is main route")
  res.json({
    message: "Hello",
  })
})

app.listen(config.PORT, () => {
  console.log(`Server running at port ${config.PORT}`)
})
