// inova-backend/src/ideias/ideias.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ideia } from './ideia.entity';
import { CreateIdeiaDto } from './dto/create-ideia.dto';
import { User } from '../users/user.entity';

@Injectable()
export class IdeiasService {
  constructor(
    @InjectRepository(Ideia)
    private ideiasRepository: Repository<Ideia>,
  ) {}

  // async criar(data: any, user: User): Promise<Ideia> {
  //   const { titulo, descricao, instituicao, anexo } = data;

  //   const ideia = this.ideiasRepository.create({
  //     titulo,
  //     descricao,
  //     instituicao,
  //     anexo: anexo ?? null, // <- Garantir que não fique undefined
  //     usuario: user,
  //   });

  //   return this.ideiasRepository.save(ideia);
  // }

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

  async listar(): Promise<any[]> {
    const ideias = await this.ideiasRepository.find({
      order: { criadoEm: 'DESC' },
    });

    return ideias.map((ideia) => ({
      id: ideia.id,
      titulo: ideia.titulo,
      descricao: ideia.descricao,
      instituicao: ideia.instituicao,
      status: ideia.status,
      likes: ideia.likes,
      criadoEm: ideia.criadoEm,
      usuario: {
        id: ideia.usuario.id,
        nome: ideia.usuario.nome,
      },
      anexoUrl: ideia.anexo
        ? `http://localhost:3000/uploads/${ideia.anexo}`
        : null,
    }));
  }

  async curtir(id: number): Promise<Ideia> {
    const ideia = await this.ideiasRepository.findOne({ where: { id } });
    if (!ideia) throw new Error('Ideia não encontrada');

    ideia.likes += 1;
    return this.ideiasRepository.save(ideia);
  }
}
