import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { validateDto } from "../middlewares/validade";
import { asyncHandler } from "../middlewares/asyncHandler";
import { CreateUserDto } from "../dtos/CreateUserDto";
import { LoginUserDto } from "../dtos/LoginUserDto";

const userRoutes = Router();

const userController = new UserController();

userRoutes.post(
  "/users",
  validateDto(CreateUserDto),
  asyncHandler((req, res) => userController.create(req, res)),
);

userRoutes.post(
  "/login",
  validateDto(LoginUserDto),
  asyncHandler((req, res) => userController.login(req, res)),
);

export { userRoutes };
