import { Router } from "express";
import { AccountController } from "../controllers/accounts";
import { authenticateToken } from "../middleware/auth";
import { validateBody } from "../utils/validateBody";
import { AccountDto } from "../dtos/accounts";
import { isOwner } from "../middleware/owner";

export default (router: Router) => {
  router.get("/accounts", authenticateToken, AccountController.getAccounts);

  router.post(
    "/account",
    authenticateToken,
    validateBody(AccountDto),
    AccountController.createAccounts
  );

  router.get(
    "/account/:accountId",
    authenticateToken,
    isOwner,
    AccountController.getAccountById
  );

  router.patch(
    "/account/:accountId",
    authenticateToken,
    isOwner,
    validateBody(AccountDto),
    AccountController.updateAccounts
  );

  router.delete(
    "/account/:accountId",
    authenticateToken,
    isOwner,
    AccountController.deleteAccount
  );
};
