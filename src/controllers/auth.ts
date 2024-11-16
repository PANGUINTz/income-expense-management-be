import { Request, Response } from "express";
import { hash, verify } from "argon2";
import uap from "ua-parser-js";

import { generateToken } from "../utils/token";
import { AuthenticatedRequest } from "../commons/type";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User.entity";
import { RefreshToken } from "../entities/RefreshToken";

const authRepository = AppDataSource.getRepository(User);
const refreshToken = AppDataSource.getRepository(RefreshToken);

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
      const data: Partial<User> = req.body;
      const userExists = await authRepository.findOne({
        where: { username: data.username },
      });
      let ua = uap(req.headers["user-agent"]);

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

      const refresh_token = {
        token,
        status: true,
        user: userExists,
        os: ua.os.name ?? "postman",
        browser: ua.browser.name ?? "postman",
      };

      const newRefreshToken = refreshToken.create(refresh_token);
      await refreshToken.save(newRefreshToken);

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

  signOut: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req["userId"];
      const token = req.headers.authorization?.split("Bearer ")[1];

      const signout = await refreshToken.update(
        { token: token, user: { id: +userId! } },
        { status: false }
      );

      if (signout.affected == 0) {
        res.status(404).send({ status: true, message: "logout failed" });
        return;
      }

      res.status(200).send({ status: true, message: "logout success" });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Error fetching auth", error });
    }
  },

  signOutAllDevice: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req["userId"];

      await refreshToken.update({ user: { id: +userId! } }, { status: false });

      res.status(200).send({ status: true, message: "logout success" });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Error fetching auth", error });
    }
  },
};
