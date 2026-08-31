import "dotenv/config";
import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./database/data-source";
import { productRoutes } from "./routes/product.routes";
import { categoryRoutes } from "./routes/category.routes";
import { errorHandler } from "./middlewares/errorHandler";
import { userRoutes } from "./routes/user.routes";

const app = express();

app.use(express.json());

app.use(productRoutes);
app.use(categoryRoutes);
app.use(userRoutes);

//Request --> Middleware --> Routes --> Controller --> Erro --> Errorhandler
app.use(errorHandler);

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
