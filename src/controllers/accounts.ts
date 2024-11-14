import { Request, Response } from "express";
import { Accounts } from "../entities/Accounts";
import { User } from "../entities/User.entity";
import { AppDataSource } from "../config/database";
import { getPaginatedData } from "../utils/paginate";
import { AuthenticatedRequest } from "../commons/type";

const accountRepository = AppDataSource.getRepository(Accounts);
const userRepository = AppDataSource.getRepository(User);
export const AccountController = {
  getAccounts: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req["userId"];
      const { page = 1, limit = 10 } = req.query;
      const result = await getPaginatedData(
        "accounts",
        accountRepository,
        +page,
        +limit,
        (queryBuilder) => {
          queryBuilder
            .select([
              "accounts.id",
              "accounts.name",
              "user.username",
              "user.id",
            ])
            .leftJoin("accounts.user", "user")
            .leftJoinAndSelect("accounts.transactions", "transactions")
            .where("user.id = :id", { id: userId });
        }
      );
      res.json(result);
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Error fetching accounts", error });
    }
  },

  getAccountById: async (req: Request, res: Response) => {
    try {
      const accountId = req.params.accountId;

      const account = await accountRepository.findOne({
        where: { id: +accountId },
        select: {
          id: true,
          name: true,
          user: {
            id: true,
            username: true,
          },
          transactions: {
            id: true,
            cost: true,
            note: true,
            category: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
      });
      if (!account) {
        res.status(400).json({
          status: false,
          message: "this account is not exists",
        });
      }

      res.json({ status: true, message: "success", data: account });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Error fetching accounts", error });
    }
  },

  createAccounts: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req["userId"];
      const userData = await userRepository.findOne({
        where: { id: +userId! },
      });

      const data: Partial<Accounts> = req.body;

      const result = accountRepository.create({ ...data, user: userData! });
      await accountRepository.save(result);

      res.json({ status: true, message: "created success" });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Error fetching accounts", error });
    }
  },

  updateAccounts: async (req: Request, res: Response) => {
    try {
      const accountId = req.params.accountId;
      const name = req.body.name;
      const account = await accountRepository.findOne({
        where: { id: +accountId },
      });

      if (!account) {
        res.status(400).json({
          status: false,
          message: "this account is not exists",
        });
      }

      await accountRepository.update({ id: +accountId }, { name });

      res.json({ status: true, message: "updated success" });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Error fetching accounts", error });
    }
  },

  deleteAccount: async (req: Request, res: Response) => {
    try {
      const accountId: number = +req.params.accountId;

      const findAccounts = await accountRepository.findOne({
        where: { id: accountId },
      });
      if (!findAccounts) {
        res.status(400).json({
          status: false,
          message: "this account is not exists",
        });
      }

      await accountRepository.delete({ id: accountId });

      res.json({ status: true, message: "deleted success" });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Error fetching accounts", error });
    }
  },
};
