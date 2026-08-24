import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Product } from "../entities/Product";
import { Category } from "../entities/Category";
import { Between, ILike, MoreThan } from "typeorm";

export class ProductController {
  async create(req: Request, res: Response): Promise<Response> {
    const productRepository = AppDataSource.getRepository(Product);
    const categoryRepository = AppDataSource.getRepository(Category);

    const { nome, descricao, preco, estoque, categoryId } = req.body;
    const category = await categoryRepository.findOneBy({
      id: Number(categoryId),
    });

    if (!category) {
      return res.status(404).json({ message: "Categoria não encontrada" });
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
    const product = await productRepository.findOne({
      where: { id },
      relations: { category: true },
    });

    if (!product) {
      return res.status(404).json({ message: "Product não encontrado" });
    }

    return res.status(200).json(product);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const productRepository = AppDataSource.getRepository(Product);

    const id: number = Number(req.params.id);
    const product = await productRepository.findOneBy({ id });

    if (!product) {
      return res.status(404).json({ message: "Product não encontrado" });
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
      return res.status(404).json({ message: "Product não encontrado" });
    }

    await productRepository.remove(product);

    return res.status(200).json({ message: "Product deletado com sucesso" });
  }

  async searchByNome(req: Request, res: Response): Promise<Response> {
    const productRepository = AppDataSource.getRepository(Product);
    const nome: string = String(req.params.nome);

    const product = await productRepository.find({
      where: { nome: ILike(`%${nome}%`) },
      relations: { category: true },
    });

    if (!product) {
      return res.status(404).json({ message: "Product nao encontrado" });
    }

    return res.status(200).json(product);
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
