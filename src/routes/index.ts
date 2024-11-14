import express from "express";

import accounts from "./accounts";
import auth from "./auth";
import category from "./category";

const router = express();

export default () => {
  accounts(router);
  auth(router);
  category(router);
  return router;
};
