import { Router } from "express";
import multer from "multer";
import fs from "fs";

import { TransactionsController } from "../controllers/transactions";
import { validateBody } from "../utils/validateBody";
import { authenticateToken } from "../middleware/auth";
import { TransactionDto } from "../dtos/transaction";

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = `./public/uploads/slip`;
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const date = new Date();
    const datenow =
      date.getFullYear() + "" + (date.getMonth() + 1) + "" + date.getDate();
    let random = Math.ceil(Math.random() * 1000000);
    console.log(random);

    cb(null, `${datenow}-${random}.jpg`);
  },
});

const upload = multer({ storage: storage });

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
};
