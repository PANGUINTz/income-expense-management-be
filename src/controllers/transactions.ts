import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { getPaginatedData } from "../utils/paginate";
import { AuthenticatedRequest } from "../commons/type";
import { Transactions } from "../entities/Transactions";
import { Accounts } from "../entities/Accounts";
import { User } from "../entities/User.entity";
import { Category } from "../entities/Category";
import { censorProfanity } from "../utils/censorProfanity";

const transactionRepository = AppDataSource.getRepository(Transactions);
const accountRepository = AppDataSource.getRepository(Accounts);
const userRepository = AppDataSource.getRepository(User);
const categoryRepository = AppDataSource.getRepository(Category);
export const TransactionsController = {
  getTransaction: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req["userId"];
      const {
        page = 1,
        limit = 10,
        filter = "daily",
        monthly,
        annual,
        category,
        account,
      } = req.query;

      //  ประจำวัน
      if (filter == "daily") {
        const date = new Date();
        const today =
          date.getFullYear() +
          "-" +
          (date.getMonth() + 1) +
          "-" +
          date.getDate();

        const result = await getPaginatedData(
          "transactions",
          transactionRepository,
          +page,
          +limit,
          (queryBuilder) => {
            queryBuilder
              .select([
                "transactions",
                "account.id",
                "account.name",
                "user.username",
                "user.id",
                "category.id",
                "category.name",
                "category.type",
              ])
              .leftJoin("transactions.account", "account")
              .leftJoin("transactions.user", "user")
              .leftJoin("transactions.category", "category")
              .where("user.id = :id", { id: userId })
              .andWhere("DATE(transactions.created_at) = :created_at", {
                created_at: today,
              });

            if (category) {
              queryBuilder.andWhere("category.type = :type", {
                type: category,
              });
            }

            if (account) {
              queryBuilder.andWhere("transactions.account_id = :account", {
                account,
              });
            }
          }
        );

        res.json(result);
        return;
      }
      //   ประจำเดือน
      else if (filter == "monthly") {
        const date = new Date();
        const annualValue = annual ?? date.getFullYear();
        const monthlyValue = monthly ?? date.getMonth() + 1;

        const result = await getPaginatedData(
          "transactions",
          transactionRepository,
          +page,
          +limit,
          (queryBuilder) => {
            queryBuilder
              .select([
                "transactions",
                "account.id",
                "account.name",
                "user.username",
                "user.id",
                "category.id",
                "category.name",
                "category.type",
              ])
              .leftJoin("transactions.account", "account")
              .leftJoin("transactions.user", "user")
              .leftJoin("transactions.category", "category")
              .where("user.id = :id", { id: userId })
              .andWhere("transactions.monthly = :monthly", {
                monthly: monthlyValue,
              })
              .andWhere("transactions.annual = :annual", {
                annual: annualValue,
              });

            if (category) {
              queryBuilder.andWhere("category.type = :type", {
                type: category,
              });
            }
            if (account) {
              queryBuilder.andWhere("transactions.account_id = :account", {
                account,
              });
            }
          }
        );
        res.json(result);
        return;
      }
      //  ประจำปี
      else if (filter == "annual") {
        const date = new Date();
        const annualValue = annual ?? date.getFullYear();

        const result = await getPaginatedData(
          "transactions",
          transactionRepository,
          +page,
          +limit,
          (queryBuilder) => {
            queryBuilder
              .select([
                "transactions",
                "account.id",
                "account.name",
                "user.username",
                "user.id",
                "category.id",
                "category.name",
                "category.type",
              ])
              .leftJoin("transactions.account", "account")
              .leftJoin("transactions.user", "user")
              .leftJoin("transactions.category", "category")
              .where("user.id = :id", { id: userId })
              .andWhere("transactions.annual = :annual", {
                annualValue,
              });

            if (category) {
              queryBuilder.andWhere("category.type = :type", {
                type: category,
              });
            }

            if (account) {
              queryBuilder.andWhere("transactions.account_id = :account", {
                account,
              });
            }
          }
        );
        res.json(result);
        return;
      }
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Error fetching transaction", error });
    }
  },

  getSummary: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req["userId"];
      const {
        page = 1,
        limit = 10,
        filter = "daily",
        monthly,
        annual,
      } = req.query;
      const { accountId } = req.params;

      //  ประจำวัน
      if (filter == "daily") {
        const date = new Date();
        const today =
          date.getFullYear() +
          "-" +
          (date.getMonth() + 1) +
          "-" +
          date.getDate();

        const income = await transactionRepository
          .createQueryBuilder("transactions")
          .select("SUM(transactions.cost) as totalIncome")
          .leftJoin("transactions.category", "category")
          .leftJoin("transactions.account", "account")
          .leftJoin("transactions.user", "user")
          .where("user.id = :id", { id: userId })
          .andWhere("transactions.account_id = :account_id", {
            account_id: accountId,
          })
          .andWhere("category.type = :type", {
            type: "income",
          })
          .andWhere("DATE(transactions.created_at) = :today", { today })
          .getRawOne();

        const expense = await transactionRepository
          .createQueryBuilder("transactions")
          .select("SUM(transactions.cost) as totalExpense")
          .leftJoin("transactions.category", "category")
          .leftJoin("transactions.account", "account")
          .leftJoin("transactions.user", "user")
          .where("user.id = :id", { id: userId })
          .andWhere("transactions.account_id = :account_id", {
            account_id: accountId,
          })
          .andWhere("category.type = :type", {
            type: "expense",
          })
          .andWhere("DATE(transactions.created_at) = :today", { today })
          .getRawOne();

        const result = {
          status: true,
          income: income.totalIncome ?? 0,
          expense: expense.totalExpense ?? 0,
          type: filter,
        };

        res.json(result);
        return;
      }
      //   ประจำเดือน
      else if (filter == "monthly") {
        const date = new Date();
        const annualValue = annual ?? date.getFullYear();
        const monthlyValue =
          (monthly && monthly?.toString()?.length < 2
            ? "0" + monthly
            : monthly) ?? date.getMonth() + 1;
        const income = await transactionRepository
          .createQueryBuilder("transactions")
          .select("SUM(transactions.cost) as totalIncome")
          .leftJoin("transactions.category", "category")
          .leftJoin("transactions.account", "account")
          .leftJoin("transactions.user", "user")
          .where("user.id = :id", { id: userId })
          .andWhere("transactions.account_id = :account_id", {
            account_id: accountId,
          })
          .andWhere("category.type = :type", {
            type: "income",
          })
          .andWhere("transactions.monthly = :monthly", {
            monthly: monthlyValue,
          })
          .andWhere("transactions.annual = :annual", {
            annual: annualValue,
          })
          .getRawOne();

        const expense = await transactionRepository
          .createQueryBuilder("transactions")
          .select("SUM(transactions.cost) as totalExpense")
          .leftJoin("transactions.category", "category")
          .leftJoin("transactions.account", "account")
          .leftJoin("transactions.user", "user")
          .where("user.id = :id", { id: userId })
          .andWhere("transactions.account_id = :account_id", {
            account_id: accountId,
          })
          .andWhere("category.type = :type", {
            type: "expense",
          })
          .andWhere("transactions.monthly = :monthly", {
            monthly: monthlyValue,
          })
          .andWhere("transactions.annual = :annual", {
            annual: annualValue,
          })
          .getRawOne();

        const result = {
          status: true,
          income: income.totalIncome ?? 0,
          expense: expense.totalExpense ?? 0,
          type: filter,
        };

        res.json(result);
        return;
      }
      //  ประจำปี
      else if (filter == "annual") {
        const date = new Date();
        const annualValue = annual ?? date.getFullYear();

        const income = await transactionRepository
          .createQueryBuilder("transactions")
          .select("SUM(transactions.cost) as totalIncome")
          .leftJoin("transactions.category", "category")
          .leftJoin("transactions.account", "account")
          .leftJoin("transactions.user", "user")
          .where("user.id = :id", { id: userId })
          .andWhere("transactions.account_id = :account_id", {
            account_id: accountId,
          })
          .andWhere("category.type = :type", {
            type: "income",
          })
          .andWhere("transactions.annual = :annual", {
            annual: annualValue,
          })
          .getRawOne();

        const expense = await transactionRepository
          .createQueryBuilder("transactions")
          .select("SUM(transactions.cost) as totalExpense")
          .leftJoin("transactions.category", "category")
          .leftJoin("transactions.account", "account")
          .leftJoin("transactions.user", "user")
          .where("user.id = :id", { id: userId })
          .andWhere("transactions.account_id = :account_id", {
            account_id: accountId,
          })
          .andWhere("category.type = :type", {
            type: "expense",
          })
          .andWhere("transactions.annual = :annual", {
            annual: annualValue,
          })
          .getRawOne();

        const result = {
          status: true,
          income: income.totalIncome ?? 0,
          expense: expense.totalExpense ?? 0,
          type: filter,
        };

        res.json(result);
        return;
      }
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Error fetching transaction", error });
    }
  },

  createTransaction: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const accountId = req.params.accountId;
      const userId = req["userId"];
      const currentDate = new Date();
      const annual = currentDate.getFullYear();
      const monthly = currentDate.getMonth() + 1;

      const slip = req.file;

      const userData = await userRepository.findOne({
        where: { id: +userId! },
      });

      const accountExists = await accountRepository.findOne({
        where: { id: +accountId },
      });

      if (!accountExists) {
        res.status(400).send({
          status: false,
          message: "account is not exist",
        });
      }
      const data = req.body;

      const profanity = data?.note ? censorProfanity(data?.note) : null;

      const combinedData: Partial<Transactions> = {
        ...data,
        user: userData!,
        account: accountExists!,
        annual: annual.toString(),
        monthly:
          monthly.toString().length < 2
            ? "0" + monthly.toString()
            : monthly.toString(),
        note: profanity,
        slip:
          (slip && `${slip?.destination.slice(1)}/${slip.filename}`) ?? null,
      };

      const result = transactionRepository.create(combinedData);
      await transactionRepository.save(result);

      res.json({ status: true, message: "created success" });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Error fetching transaction", error });
    }
  },
};
