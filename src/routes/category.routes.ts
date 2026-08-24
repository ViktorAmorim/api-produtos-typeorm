import { Router } from "express";
import { CategoryController } from "../controllers/CategoryController";

const categoryRoutes = Router();

const categoryController = new CategoryController();

categoryRoutes.post("/categories", (req, res) => {
  categoryController.create(req, res);
});

categoryRoutes.get("/categories", (req, res) => {
  categoryController.findAllCategories(req, res);
});

categoryRoutes.get("/categories/:id", (req, res) => {
  categoryController.findOneCategoryById(req, res);
});

export { categoryRoutes };
