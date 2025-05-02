// inova-backend/src/ideias/ideias.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ideia } from './ideia.entity';
import { CreateIdeiaDto } from './dto/create-ideia.dto';
import { User } from '../users/user.entity';
import { IdeiaLike } from '../likes/ideia-like.entity';

@Injectable()
export class IdeiasService {
  constructor(
    @InjectRepository(Ideia)
    private ideiasRepository: Repository<Ideia>,
    @InjectRepository(IdeiaLike)
    private ideiaLikesRepository: Repository<IdeiaLike>,
  ) {}

  async criar(data: any, user: User): Promise<Ideia> {
    const novaIdeia = new Ideia(); // <- Criar instância vazia e popular manualmente

    novaIdeia.titulo = data.titulo;
    novaIdeia.descricao = data.descricao;
    novaIdeia.instituicao = data.instituicao;
    novaIdeia.anexo = data.anexo ?? null;
    novaIdeia.usuario = { id: user.id } as User; // <-- Atenção aqui!
    novaIdeia.status = 'Cadastrado'; // Definir manualmente o default
    novaIdeia.likes = 0; // Definir manualmente também

    return this.ideiasRepository.save(novaIdeia);
  }

  async listar(userId?: number): Promise<any[]> {
    const ideias = await this.ideiasRepository.find({
      order: { criadoEm: 'DESC' },
      relations: ['usuario'],
    });

    if (!userId) return ideias;

    const likes = await this.ideiaLikesRepository.find({
      where: { usuario: { id: userId } },
      relations: ['ideia'],
    });

    const likedIds = new Set(likes.map((l) => l.ideia.id));

    return ideias.map((ideia) => ({
      ...ideia,
      likedByUser: likedIds.has(ideia.id),
    }));

    // return ideias.map((ideia) => ({
    //   id: ideia.id,
    //   titulo: ideia.titulo,
    //   descricao: ideia.descricao,
    //   instituicao: ideia.instituicao,
    //   status: ideia.status,
    //   likes: ideia.likes,
    //   criadoEm: ideia.criadoEm,
    //   usuario: {
    //     id: ideia.usuario.id,
    //     nome: ideia.usuario.nome,
    //   },
    //   anexoUrl: ideia.anexo
    //     ? `http://localhost:3000/uploads/${ideia.anexo}`
    //     : null,
    // }));
  }

  async curtir(id: number, user: User): Promise<Ideia> {
    const ideia = await this.ideiasRepository.findOne({ where: { id } });
    if (!ideia) throw new NotFoundException('Ideia não encontrada');

    const jaCurtiu = await this.ideiaLikesRepository.findOne({
      where: { ideia: { id }, usuario: { id: user.id } },
    });

    if (jaCurtiu) {
      throw new BadRequestException('Você já curtiu esta ideia');
    }

    ideia.likes += 1;
    await this.ideiaLikesRepository.save(
      this.ideiaLikesRepository.create({ ideia, usuario: user }),
    );

    return this.ideiasRepository.save(ideia);
  }
}
