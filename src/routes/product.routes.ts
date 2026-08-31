import { Router } from "express";
import { ProductController } from "../controllers/ProductController";
import { validateDto } from "../middlewares/validade";
import { CreateProductDto } from "../dtos/CreateProductDto";
import { UpdateProductDto } from "../dtos/UpdateProductDto";
import { SearchProductDto } from "../dtos/SearchProductDto";
import { asyncHandler } from "../middlewares/asyncHandler";

const productRoutes = Router();

const productController = new ProductController();

productRoutes.post(
  "/products",
  validateDto(CreateProductDto),
  asyncHandler((req, res) => productController.create(req, res)),
);

productRoutes.get(
  "/products",
  asyncHandler((req, res) => productController.findAll(req, res)),
);

// Rotas específicas primeiro
productRoutes.get(
  "/products/search",
  validateDto(SearchProductDto),
  asyncHandler((req, res) => productController.search(req, res)),
);

productRoutes.get(
  "/products/stock/available",
  asyncHandler((req, res) => productController.findAvaliable(req, res)),
);

productRoutes.get(
  "/products/stock/empty",
  asyncHandler((req, res) => productController.findOutOfStock(req, res)),
);

productRoutes.get(
  "/products/filter",
  asyncHandler((req, res) => productController.findPriceRange(req, res)),
);

// Rotas com :id por último
productRoutes.get(
  "/products/:id",
  asyncHandler((req, res) => productController.findOne(req, res)),
);

productRoutes.put(
  "/products/:id",
  validateDto(UpdateProductDto),
  asyncHandler((req, res) => productController.update(req, res)),
);

productRoutes.delete(
  "/products/:id",
  asyncHandler((req, res) => productController.delete(req, res)),
);

export { productRoutes };
