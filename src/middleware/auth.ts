import { Request, Response, NextFunction } from "express";
import { validateToken } from "../utils/token";
import { AuthenticatedRequest } from "../commons/type";

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).send({ status: false, message: "Unauthorized" });
    return;
  }

  const decodedToken = validateToken(token);

  if (!decodedToken) {
    res.status(403).send({ status: false, message: "forbidden" });
    return;
  }

  (req as AuthenticatedRequest).userId = decodedToken.userId;
  next();
}
