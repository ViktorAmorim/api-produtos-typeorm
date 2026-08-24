import { Router } from "express";
import { ProductController } from "../controllers/ProductController";

const productRoutes = Router();

const productController = new ProductController();

productRoutes.post("/products", (req, res) =>
  productController.create(req, res),
);

productRoutes.get("/products", (req, res) =>
  productController.findAll(req, res),
);

// Rotas específicas primeiro
productRoutes.get("/products/search/:nome", (req, res) =>
  productController.searchByNome(req, res),
);

productRoutes.get("/products/stock/available", (req, res) =>
  productController.findAvaliable(req, res),
);

productRoutes.get("/products/stock/empty", (req, res) =>
  productController.findOutOfStock(req, res),
);

productRoutes.get("/products/filter", (req, res) =>
  productController.findPriceRange(req, res),
);

// Rotas com :id por último
productRoutes.get("/products/:id", (req, res) =>
  productController.findOne(req, res),
);

productRoutes.put("/products/:id", (req, res) =>
  productController.update(req, res),
);

productRoutes.delete("/products/:id", (req, res) =>
  productController.delete(req, res),
);

export { productRoutes };
