import { userToken } from "../middleware/authMiddleware";

declare global {
  namespace Express {
    interface Request {
      user?: userToken;
    }
  }
}

export {};