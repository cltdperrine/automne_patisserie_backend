import { Router } from "express";
import authController from "./controllers/index.js";

const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/sign-in", authController.signIn);
authRouter.post("/sign-out", authController.signOut);

export default authRouter;
