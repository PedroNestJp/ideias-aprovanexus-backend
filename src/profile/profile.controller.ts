// src/perfil/perfil.controller.ts
import {
  Controller,
  Get,
  UseGuards,
  Request,
  Patch,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ideia } from '../ideias/ideia.entity';
import { Comentario } from '../comentarios/comentario.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { PerfilService } from './profile.service';
import { getMulterS3Config } from '../aws/s3.config';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('perfil')
@UseGuards(JwtAuthGuard)
export class PerfilController {
  constructor(
    @InjectRepository(Ideia)
    private ideiasRepository: Repository<Ideia>,
    @InjectRepository(Comentario)
    private comentariosRepository: Repository<Comentario>,
    private readonly perfilService: PerfilService,
  ) {}

  @Patch()
  @UseInterceptors(
    FileInterceptor('foto', { storage: getMulterS3Config('fotos-perfil') }),
  )
  async atualizarPerfil(
    @Request() req,
    @UploadedFile() foto: Express.Multer.File,
    @Body() body: UpdateProfileDto,
  ) {
    const imageUrl = (foto as any)?.location;
    return this.perfilService.atualizarPerfil(req.user.id, body.nome, imageUrl);
  }

  @Patch('senha')
  async alterarSenha(
    @Request() req,
    @Body('senhaAtual') senhaAtual: string,
    @Body('novaSenha') novaSenha: string,
  ) {
    return this.perfilService.alterarSenha(req.user.id, senhaAtual, novaSenha);
  }

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
