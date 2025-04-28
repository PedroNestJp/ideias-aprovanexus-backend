import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateIdeiaDto {
  @IsNotEmpty()
  titulo!: string;

  @IsNotEmpty()
  descricao!: string;

  @IsNotEmpty()
  instituicao!: string;

  @IsOptional()
  @IsString()
  anexo?: string;
}
