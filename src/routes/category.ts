import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { isOwner } from "../middleware/owner";
import { validateBody } from "../utils/validateBody";
import { CategoryDto } from "../dtos/category";
import { CategoryController } from "../controllers/category";

export default (router: Router) => {
  router.get("/category", authenticateToken, CategoryController.getCategory);

  router.post(
    "/category",
    authenticateToken,
    validateBody(CategoryDto),
    CategoryController.createCategory
  );

  router.delete(
    "/category/:categoryId",
    authenticateToken,
    isOwner,
    CategoryController.deleteCategory
  );
};
