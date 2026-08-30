import { Router } from "express";
import { CategoryController } from "../controllers/CategoryController";
import { asyncHandler } from "../middlewares/asyncHandler";
import { validateDto } from "../middlewares/validade";
import { CreateCategoryDto } from "../dtos/CreateCategoryDto";

const categoryRoutes = Router();

const categoryController = new CategoryController();

categoryRoutes.post(
  "/categories",
  validateDto(CreateCategoryDto),
  asyncHandler((req, res) => {
    return categoryController.create(req, res);
  }),
);

categoryRoutes.get(
  "/categories",
  asyncHandler((req, res) => {
    return categoryController.findAllCategories(req, res);
  }),
);

categoryRoutes.get(
  "/categories/:id",
  asyncHandler((req, res) => {
    return categoryController.findOneCategoryById(req, res);
  }),
);

export { categoryRoutes };
