import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comentario } from './comentario.entity';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { Ideia } from '../ideias/ideia.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ComentariosService {
  constructor(
    @InjectRepository(Comentario)
    private comentariosRepository: Repository<Comentario>,
    @InjectRepository(Ideia)
    private ideiasRepository: Repository<Ideia>,
  ) {}

  async criar(
    ideiaId: number,
    dto: CreateComentarioDto,
    user: User,
  ): Promise<Comentario> {
    const ideia = await this.ideiasRepository.findOne({
      where: { id: ideiaId },
    });
    if (!ideia) throw new NotFoundException('Ideia não encontrada');

    const comentario = this.comentariosRepository.create({
      texto: dto.texto,
      ideia,
      autor: user,
    });

    return this.comentariosRepository.save(comentario);
  }

  async listarPorIdeia(ideiaId: number): Promise<Comentario[]> {
    return this.comentariosRepository.find({
      where: { ideia: { id: ideiaId } },
      order: { criadoEm: 'ASC' },
    });
  }

  async curtirComentario(id: number): Promise<Comentario> {
    const comentario = await this.comentariosRepository.findOne({
      where: { id },
    });

    if (!comentario) {
      throw new NotFoundException('Comentário não encontrado');
    }

    comentario.likes = (comentario.likes || 0) + 1;
    return this.comentariosRepository.save(comentario);
  }
}
