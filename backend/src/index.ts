import app from "@/app"
import config from "@/configs/env"

// Enviroment check
if (config.isProd) {
  console.log("Running in production mode")
} else {
  console.log("Running in development mode")
}

// Start the server
const server = app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`)
})

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server")
  server.close(() => {
    console.log("HTTP server closed")
    process.exit(0)
  })
})

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server")
  server.close(() => {
    console.log("HTTP server closed")
    process.exit(0)
  })
})

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.log("Uncaught Exception:", error)
  process.exit(1)
})

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason)
  process.exit(1)
})
