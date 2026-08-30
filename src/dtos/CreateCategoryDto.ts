import { IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {
  @IsString({
    message: "O campo nome deve ser preenchido!",
  })
  @IsNotEmpty({
    message: "O campo nome deve ser um texto!",
  })
  nome!: string;

  @IsString({
    message: "O campo nome deve ser um texto!",
  })
  @IsNotEmpty({
    message:
      "O campo não pode conter valores vazios ou apenas espaços em branco",
  })
  descricao!: string;
}
