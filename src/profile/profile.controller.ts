// src/perfil/perfil.controller.ts
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ideia } from '../ideias/ideia.entity';
import { Comentario } from '../comentarios/comentario.entity';

@Controller('perfil')
@UseGuards(JwtAuthGuard)
export class PerfilController {
  constructor(
    @InjectRepository(Ideia)
    private ideiasRepository: Repository<Ideia>,
    @InjectRepository(Comentario)
    private comentariosRepository: Repository<Comentario>,
  ) {}

  @Get('ideias')
  async minhasIdeias(@Request() req) {
    return this.ideiasRepository.find({
      where: { usuario: { id: req.user.id } },
      order: { criadoEm: 'DESC' },
    });
  }

  @Get('comentarios')
  async meusComentarios(@Request() req) {
    return this.comentariosRepository.find({
      where: { autor: { id: req.user.id } },
      relations: ['ideia'],
      order: { criadoEm: 'DESC' },
    });
  }
}
