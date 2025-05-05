import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comentario } from './comentario.entity';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { Ideia } from '../ideias/ideia.entity';
import { User } from '../users/user.entity';
import { ComentarioLike } from '../likes/comments-like.entity';

@Injectable()
export class ComentariosService {
  constructor(
    @InjectRepository(Comentario)
    private comentariosRepository: Repository<Comentario>,
    @InjectRepository(Ideia)
    private ideiasRepository: Repository<Ideia>,
    @InjectRepository(ComentarioLike)
    private comentarioLikeRepository: Repository<ComentarioLike>,
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
      anexo: dto.anexo,
    });

    return this.comentariosRepository.save(comentario);
  }

  async listarPorIdeia(
    ideiaId: number,
    userId?: number,
  ): Promise<Comentario[]> {
    const comentarios = await this.comentariosRepository.find({
      where: { ideia: { id: ideiaId } },
      relations: ['autor'],
      order: { criadoEm: 'ASC' },
    });

    if (!userId) return comentarios;

    const likes = await this.comentarioLikeRepository.find({
      where: { usuario: { id: userId } },
      relations: ['comentario'],
    });

    const likedIds = new Set(likes.map((l) => l.comentario.id));

    return comentarios.map((c) => ({
      ...c,
      likedByUser: likedIds.has(c.id),
    }));
  }

  async curtirComentario(
    comentarioId: number,
    user: User,
  ): Promise<Comentario> {
    const comentario = await this.comentariosRepository.findOne({
      where: { id: comentarioId },
    });
    if (!comentario) {
      throw new NotFoundException('Comentário não encontrado');
    }

    const jaCurtiu = await this.comentarioLikeRepository.findOne({
      where: { comentario: { id: comentarioId }, usuario: { id: user.id } },
    });
    if (jaCurtiu) {
      throw new BadRequestException('Você já curtiu este comentário');
    }

    comentario.likes += 1;
    await this.comentariosRepository.save(comentario);

    const novoLike = this.comentarioLikeRepository.create({
      comentario,
      usuario: user,
    });
    await this.comentarioLikeRepository.save(novoLike);

    return comentario;
  }
}
