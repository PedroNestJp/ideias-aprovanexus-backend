import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comentario } from './comentario.entity';
import { ComentariosService } from './comentarios.service';
import { ComentariosController } from './comentarios.controller';
import { Ideia } from '../ideias/ideia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comentario, Ideia])],
  controllers: [ComentariosController],
  providers: [ComentariosService],
})
export class ComentariosModule {}
