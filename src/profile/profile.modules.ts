// src/perfil/perfil.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ideia } from '../ideias/ideia.entity';
import { Comentario } from '../comentarios/comentario.entity';
import { PerfilController } from './profile.controller';
import { PerfilService } from './profile.service';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ideia, Comentario, User])],
  controllers: [PerfilController],
  providers: [PerfilService],
})
export class PerfilModule {}
