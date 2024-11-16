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
              queryBuilder.andWhere("transactions.category_id = :category_id", {
                category_id: category,
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
              queryBuilder.andWhere("transactions.category_id = :category_id", {
                category_id: category,
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
              queryBuilder.andWhere("transactions.category_id = :category_id", {
                category_id: category,
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

      if (slip && slip.size > 1000000) {
        res
          .status(405)
          .send({ status: false, message: "File too large limit 1MB." });
        return;
      }

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

      res.status(201).json({ status: true, message: "created success" });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Error fetching transaction", error });
    }
  },

  averageMonth: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { accountId } = req.params;
      const userId = req["userId"];

      const accountExists = await accountRepository.findOne({
        where: { id: +accountId, user: { id: +userId! } },
        relations: ["user"],
      });

      if (!accountExists) {
        res
          .status(404)
          .send({ status: false, message: "account is not exists" });
        return;
      }

      const date = new Date();
      const lastDay = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        0
      ).getDate();

      const currentDay = new Date();
      const remainDate = lastDay - currentDay.getDate();

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
          monthly: currentDay.getMonth() + 1,
        })
        .andWhere("transactions.annual = :annual", {
          annual: currentDay.getFullYear(),
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
          monthly: currentDay.getMonth() + 1,
        })
        .andWhere("transactions.annual = :annual", {
          annual: currentDay.getFullYear(),
        })
        .getRawOne();

      const income_cost = income.totalIncome ?? 0;
      const expense_cost = expense.totalExpense ?? 0;

      res.status(200).send({
        income: income_cost,
        expense: expense_cost,
        remain_cost: income_cost - expense_cost,
        remain_date: remainDate,
        cost_per_date: Math.max(
          0,
          Math.floor((income.totalIncome - expense.totalExpense) / remainDate)
        ),
      });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Error fetching transaction", error });
    }
  },
};
