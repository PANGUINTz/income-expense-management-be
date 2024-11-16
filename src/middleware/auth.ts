import { Request, Response, NextFunction } from "express";
import { validateToken } from "../utils/token";
import { AuthenticatedRequest } from "../commons/type";
import { AppDataSource } from "../config/database";
import { RefreshToken } from "../entities/RefreshToken";

export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const refreshToken = AppDataSource.getRepository(RefreshToken);
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).send({ status: false, message: "Unauthorized" });
    return;
  }
  const refreshTokenVerify = await refreshToken.findOne({
    where: { token: token, status: true },
    relations: ["user"],
  });

  if (!refreshTokenVerify) {
    res.status(403).send({ status: false, message: "forbidden" });
    return;
  }

  (req as AuthenticatedRequest).userId = refreshTokenVerify.user.id.toString();
  next();
}
