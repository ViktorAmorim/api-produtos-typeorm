import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./database/data-source";
import { productRoutes } from "./routes/product.routes";
import { categoryRoutes } from "./routes/category.routes";
const app = express();

app.use(express.json());

app.use(productRoutes);
app.use(categoryRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source iniciado!");

    app.listen(3000, () => {
      console.log("Server rodando na porta 3000");
    });
  })
  .catch((err) => {
    console.error("Error ao inicializar o Data Source", err);
  });
