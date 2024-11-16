import { Router } from "express";
import { AuthController } from "../controllers/auth";
import { validateBody } from "../utils/validateBody";
import { AuthDto } from "../dtos/auth";
import { authenticateToken } from "../middleware/auth";

export default async (router: Router) => {
  router.post("/auth/signup", validateBody(AuthDto), AuthController.signUp);
  router.post("/auth/signin", validateBody(AuthDto), AuthController.signIn);
  router.get("/auth/profile", authenticateToken, AuthController.profile);
  router.get("/auth/signout", authenticateToken, AuthController.signOut);
  router.get(
    "/auth/signout-all",
    authenticateToken,
    AuthController.signOutAllDevice
  );
};
