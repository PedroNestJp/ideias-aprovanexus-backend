import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Get,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('ideias/:ideiaId/comentarios')
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('anexo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const ext = extname(file.originalname);
          const fileName = `${Date.now()}-${file.originalname}`;
          cb(null, fileName);
        },
      }),
    }),
  )
  async comentar(
    @Param('ideiaId') ideiaId: number,
    @Body() dto: CreateComentarioDto,
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.comentariosService.criar(
      ideiaId,
      { ...dto, anexo: file?.filename },
      req.user,
    );
  }

  @Get()
  async listar(@Param('ideiaId') ideiaId: number) {
    return this.comentariosService.listarPorIdeia(ideiaId);
  }
}
