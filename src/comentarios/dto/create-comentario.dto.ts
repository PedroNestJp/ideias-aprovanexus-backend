import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateComentarioDto {
  @IsNotEmpty()
  @IsString()
  texto!: string;

  @IsOptional()
  @IsString()
  anexo?: string;
}
