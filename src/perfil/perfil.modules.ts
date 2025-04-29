// src/perfil/perfil.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ideia } from '../ideias/ideia.entity';
import { Comentario } from '../comentarios/comentario.entity';
import { PerfilController } from './perfil.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Ideia, Comentario])],
  controllers: [PerfilController],
})
export class PerfilModule {}
