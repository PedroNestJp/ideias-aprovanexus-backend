import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comentario } from './comentario.entity';
import { ComentariosService } from './comentarios.service';
import { ComentariosController } from './comentarios.controller';
import { ComentariosLikeController } from './comentarios-like.controller';
import { Ideia } from '../ideias/ideia.entity';
import { ComentarioLike } from '../likes/comments-like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comentario, Ideia, ComentarioLike])],
  controllers: [ComentariosController, ComentariosLikeController],
  providers: [ComentariosService],
})
export class ComentariosModule {}
