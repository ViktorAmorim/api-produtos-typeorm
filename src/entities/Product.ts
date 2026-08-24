import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Category } from "./Category";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar", { length: 150, nullable: false, unique: true })
  nome!: string;

  @Column("varchar", { length: 255, nullable: false })
  descricao!: string;

  @Column("decimal", { precision: 10, scale: 2, nullable: false })
  preco!: number;

  @Column("integer", { default: 0 })
  estoque!: number;

  @ManyToOne(
    () => Category, // indica qual entidade está do outro lado do relacionamento
    (category) => category.products, // indica qual property da entidade Category representa o outro lado do relacionamento
  )
  @JoinColumn({ name: "categoryId" }) // especifica o nome da coluna de chave estrangeira
  category!: Category;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
