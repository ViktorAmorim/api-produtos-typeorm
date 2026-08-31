import { Transform, Type } from "class-transformer";
import { IsIn, IsNumber, IsOptional, IsString } from "class-validator";

export class SearchProductDto {
  @IsOptional()
  @IsString()
  nome!: string;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  categoryId!: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  sort?: "nome" | "preco" | "estoque";

  @Transform(({ value }) => value.toUpperCase())
  @IsOptional()
  @IsIn(["ASC", "DESC"])
  order?: "DESC" | "ASC";

  @Type(() => Number)
  @IsNumber()
  page?: number;

  @Type(() => Number)
  @IsNumber()
  limit = 10;
}
