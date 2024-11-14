import { Request, Response } from "express";
import { User } from "../entities/User.entity";
import { AppDataSource } from "../config/database";
import { hash, verify } from "argon2";
import { generateToken, validateToken } from "../utils/token";
import { AuthenticatedRequest } from "../commons/type";

export const authRepository = AppDataSource.getRepository(User);
export const AuthController = {
  signUp: async (req: Request, res: Response) => {
    try {
      const data: Partial<User> = req.body;
      const hashedPassword = await hash(data.password!);
      const userExists = await authRepository.findOne({
        where: { username: data.username },
      });
      if (userExists) {
        res
          .status(400)
          .json({ status: false, message: "Error username is exists" });
        return;
      }
      const result = authRepository.create({
        ...data,
        password: hashedPassword,
      });
      await authRepository.save(result);

      res.json({ status: true, ...result });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Error fetching auth", error });
    }
  },

  signIn: async (req: Request, res: Response) => {
    try {
      const ip =
        req.headers["cf-connecting-ip"] ||
        req.headers["x-real-ip"] ||
        req.headers["x-forwarded-for"] ||
        req.socket.remoteAddress ||
        "";

      const data: Partial<User> = req.body;
      const userExists = await authRepository.findOne({
        where: { username: data.username },
      });

      if (!userExists) {
        res
          .status(400)
          .json({ status: false, message: "Error username is not found" });
        return;
      }

      const verifyPassword = await verify(
        userExists?.password!,
        data.password!
      );

      if (!verifyPassword) {
        res
          .status(400)
          .json({ status: false, message: "Error password is not match" });
        return;
      }

      const token = generateToken(userExists?.id!);
      res.status(200).json({
        status: true,
        message: "success",
        type: "Bearer",
        token: token,
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Error fetching auth", error });
    }
  },

  profile: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req["userId"];
      const data = await authRepository.findOne({
        where: { id: +userId! },
        select: ["id", "username"],
      });
      res.status(200).json({
        status: true,
        message: "success",
        data: data,
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Error fetching auth", error });
    }
  },
};
