import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../commons/type";
import { AppDataSource } from "../config/database";
import { Accounts } from "../entities/Accounts";
import { Category } from "../entities/Category";

export async function isOwner(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const accountRepository = AppDataSource.getRepository(Accounts);
  const categoryRepository = AppDataSource.getRepository(Category);
  const pathname = req["path"].split("/")[1];
  const id = req["path"].split("/")[2];
  const userId = req["userId"];

  if (pathname == "account") {
    const accountData = await accountRepository.findOne({
      where: { id: +id },
      relations: ["user"],
    });

    if (accountData?.user?.id != userId || !accountData) {
      res.status(401).send({ status: false, message: "Unauthorized" });
      return;
    }
    next();
  } else if (pathname == "category") {
    const categoryData = await categoryRepository.findOne({
      where: { id: +id },
      relations: ["user"],
    });

    if (categoryData?.user?.id != userId || !categoryData) {
      res.status(401).send({ status: false, message: "Unauthorized" });
      return;
    }
    next();
  } else if (pathname == "transaction") {
  }
}
