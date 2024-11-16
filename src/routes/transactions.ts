import { Router } from "express";

import { TransactionsController } from "../controllers/transactions";
import { validateBody } from "../utils/validateBody";
import { authenticateToken } from "../middleware/auth";
import { TransactionDto } from "../dtos/transaction";
import { upload } from "../middleware/multer";

export default async (router: Router) => {
  router.get(
    "/transaction",
    authenticateToken,
    TransactionsController.getTransaction
  );
  router.post(
    "/transaction/:accountId",
    authenticateToken,
    upload.single("slip"),
    validateBody(TransactionDto),
    TransactionsController.createTransaction
  );
  router.get(
    "/transaction/summary/:accountId",
    authenticateToken,
    TransactionsController.getSummary
  );

  router.get(
    "/transaction/average/:accountId",
    authenticateToken,
    TransactionsController.averageMonth
  );
};
