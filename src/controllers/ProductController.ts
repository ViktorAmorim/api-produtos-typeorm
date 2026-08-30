import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Product } from "../entities/Product";
import { Category } from "../entities/Category";
import { Between, ILike, MoreThan } from "typeorm";
import { AppError } from "../errors/AppError";

export class ProductController {
  async create(req: Request, res: Response): Promise<Response> {
    const productRepository = AppDataSource.getRepository(Product);
    const categoryRepository = AppDataSource.getRepository(Category);

    const { nome, descricao, preco, estoque, categoryId } = req.body;

    const existProduct = await productRepository.existsBy({
      nome: req.body.nome,
    });

    if (existProduct) {
      throw new AppError("Product ja cadastrado", 409);
    }

    const category = await categoryRepository.findOneBy({
      id: Number(categoryId),
    });

    if (!category) {
      throw new AppError("Category nao encontrada", 404);
    }

    const product = productRepository.create({
      nome,
      descricao,
      preco,
      estoque,
      category,
    });

    const savedProduct = await productRepository.save(product);

    return res.status(201).json(savedProduct);
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    const productRepository = AppDataSource.getRepository(Product);

    const products = await productRepository.find({
      relations: { category: true }, // Inclui a relação com a entidade Category
    });

    return res.json(products);
  }

  async findOne(req: Request, res: Response): Promise<Response> {
    const productRepository = AppDataSource.getRepository(Product);

    const id: number = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new AppError("Id do produto inváliddo", 400);
    }
    const product = await productRepository.findOne({
      where: { id },
      relations: { category: true },
    });

    if (!product) {
      throw new AppError("Product nao encontrado", 404);
    }

    return res.status(200).json(product);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const productRepository = AppDataSource.getRepository(Product);

    const id: number = Number(req.params.id);
    const product = await productRepository.findOneBy({ id });

    if (!product) {
      throw new AppError("Product nao encontrado", 404);
    }

    productRepository.merge(product, req.body);

    const updatedProduct = await productRepository.save(product);

    return res.status(200).json(updatedProduct);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const productRepository = AppDataSource.getRepository(Product);

    const id: number = Number(req.params.id);
    const product = await productRepository.findOneBy({ id });

    if (!product) {
      throw new AppError("Product nao encontrado", 404);
    }

    await productRepository.remove(product);

    return res.status(200).json({ message: "Product deletado com sucesso" });
  }

  async search(req: Request, res: Response): Promise<Response> {
    const {
      nome,
      categoryId,
      minPrice,
      maxPrice,
      category,
      sort,
      order,
      page,
      limit,
    } = req.query;

    /* Implementar DTO para representar os dados recebidos */

    const repository = AppDataSource.getRepository(Product);

    const query = repository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category");

    if (nome) {
      query.andWhere("product.nome ILIKE :nome", {
        nome: `%${nome}%`,
      });
    }

    if (categoryId) {
      query.andWhere("product.categoryId = :categoryId", {
        categoryId: Number(categoryId),
      });
    }

    if (category) {
      query.andWhere("category.nome  ILIKE :category", {
        category: `%${category}%`,
      });
    }

    if (minPrice) {
      query.andWhere("product.preco >= :minPrice", {
        minPrice: Number(minPrice),
      });
    }

    if (maxPrice) {
      query.andWhere("product.preco <= :maxPrice", {
        maxPrice: Number(maxPrice),
      });
    }

    const allowedFields: Record<string, string> = {
      nome: "product.nome",
      preco: "product.preco",
      estoque: "product.estoque",
      category: "category.nome",
    };

    const sortFields = allowedFields[String(sort) ?? ""] ?? "product.nome";
    const sortOrder = String(order).toUpperCase() === "DESC" ? "DESC" : "ASC";
    query.orderBy(sortFields, sortOrder);

    const currentPage = Number(page) || 1;
    const itemsPerPage = Number(limit) || 10;

    const offset = (currentPage - 1) * itemsPerPage;
    query.skip(offset);

    const [products, total] = await query.getManyAndCount();

    const totalPages = Math.ceil(total / itemsPerPage);

    return res.status(200).json({
      data: products,
      pagination: {
        page: currentPage,
        limit: itemsPerPage,
        total,
        totalPages,
      },
    });
  }

  async findAvaliable(req: Request, res: Response): Promise<Response> {
    const productRepository = AppDataSource.getRepository(Product);

    const products = await productRepository.find({
      where: { estoque: MoreThan(0) },
      relations: { category: true },
    });

    return res.status(200).json(products);
  }

  async findOutOfStock(req: Request, res: Response): Promise<Response> {
    const productRepository = AppDataSource.getRepository(Product);

    const products = await productRepository.find({
      where: { estoque: 0 },
      relations: { category: true },
    });

    return res.status(200).json(products);
  }

  async findPriceRange(req: Request, res: Response): Promise<Response> {
    const productRepository = AppDataSource.getRepository(Product);

    const min: number = Number(req.query.min);
    const max: number = Number(req.query.max);

    // Verifica se os parâmetros min e max são numeros
    if (Number.isNaN(min) || Number.isNaN(max)) {
      return res.status(400).json({ message: "Parâmetros inválidos" });
    }
    // Verifica se min é menor que max
    if (min > max) {
      return res.status(400).json({
        message: "O valor mínimo não pode ser maior que o valor máximo",
      });
    }

    const products = await productRepository.find({
      where: { preco: Between(min, max) },
      relations: { category: true },
    });

    return res.status(200).json(products);
  }
}
