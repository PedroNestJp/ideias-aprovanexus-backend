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
  Post,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ideia } from '../ideias/ideia.entity';
import { Comentario } from '../comentarios/comentario.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PerfilService } from './profile.service';

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
    FileInterceptor('foto', {
      storage: diskStorage({
        destination: './uploads/fotos-perfil',
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          const fileName = `${Date.now()}-${file.originalname}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  async atualizarPerfil(
    @Request() req,
    @UploadedFile() foto: Express.Multer.File,
    @Body('nome') nome: string,
  ) {
    const caminhoFoto = foto ? foto.filename : undefined;
    return this.perfilService.atualizarPerfil(req.user.id, nome, caminhoFoto);
  }

  // alterar senha
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
