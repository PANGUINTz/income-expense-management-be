import { Request, Response } from "express";
import { User } from "../entities/User.entity";
import { AppDataSource } from "../config/database";
import { AuthenticatedRequest } from "../commons/type";
import { Category } from "../entities/Category";

const categoryRepository = AppDataSource.getRepository(Category);
const userRepository = AppDataSource.getRepository(User);
export const CategoryController = {
  getCategory: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req["userId"];
      const result = await categoryRepository
        .createQueryBuilder("category")
        .leftJoin("category.user", "user")
        .where("user.id = :id", { id: userId })
        .orWhere("category.is_public = :is_public", { is_public: 1 })
        .getMany();
      res.json({ status: true, data: result });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Error fetching category", error });
    }
  },

  createCategory: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req["userId"];
      const userData = await userRepository.findOne({
        where: { id: +userId! },
      });

      const data: Partial<Category> = req.body;

      const result = categoryRepository.create({ ...data, user: userData! });
      await categoryRepository.save(result);

      res.json({ status: true, message: "created success" });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Error fetching category", error });
    }
  },

  deleteCategory: async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req["userId"];
      const categoryId: number = +req.params.categoryId;

      const findCategory = await categoryRepository.findOne({
        where: { id: categoryId, user: { id: +userId! } },
        relations: ["user"],
      });
      if (!findCategory) {
        res.status(400).json({
          status: false,
          message: "this category is not exists",
        });
      }

      await categoryRepository.delete({ id: categoryId });

      res.json({ status: true, message: "deleted success" });
    } catch (error) {
      res
        .status(500)
        .json({ status: false, message: "Error fetching category", error });
    }
  },
};
