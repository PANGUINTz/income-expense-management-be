import express from "express";

import accounts from "./accounts";
import auth from "./auth";
import category from "./category";
import transactions from "./transactions";

const router = express();

export default () => {
  accounts(router);
  auth(router);
  category(router);
  transactions(router);
  return router;
};
