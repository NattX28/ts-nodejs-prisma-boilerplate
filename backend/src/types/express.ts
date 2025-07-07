import { User } from "@/types/auth"

declare global {
  namespace Express {
    interface Request {
      user?: Omit<User, "password"> // User object without password
    }
  }
}
