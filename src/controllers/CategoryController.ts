import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Category } from "../entities/Category";

export class CategoryController {
  async create(req: Request, res: Response): Promise<Response> {
    const categoryRepository = AppDataSource.getRepository(Category);

    const category = categoryRepository.create(req.body);
    const savedCategory = await categoryRepository.save(category);
    return res.status(201).json(savedCategory);
  }

  async findOneCategoryById(req: Request, res: Response): Promise<Response> {
    const categoryRepository = AppDataSource.getRepository(Category);

    const id: number = Number(req.params.id);
    const category = await categoryRepository.findOne({
      where: { id },
      relations: { products: true },
    });

    if (!category) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }

    return res.status(200).json(category);
  }

  async findAllCategories(req: Request, res: Response): Promise<Response> {
    const categoryRepository = AppDataSource.getRepository(Category);

    const categories = await categoryRepository.find();

    return res.status(200).json(categories);
  }
}
