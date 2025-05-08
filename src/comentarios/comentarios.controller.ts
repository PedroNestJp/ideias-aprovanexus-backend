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
import { FileInterceptor } from '@nestjs/platform-express';
import { getMulterS3Config } from '../aws/s3.config';

@Controller('ideias/:ideiaId/comentarios')
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('anexo', {
      storage: getMulterS3Config('anexos-comentarios'),
    }),
  )
  async comentar(
    @Param('ideiaId') ideiaId: number,
    @Body() dto: CreateComentarioDto,
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const File = (file as any)?.location;
    console.log('File:', File);
    const data = {
      ...dto,
      anexo: File,
    };
    return this.comentariosService.criar(ideiaId, data, req.user);
  }

  @Get()
  async listarPorIdeia(@Param('ideiaId') ideiaId: number, @Request() req) {
    return this.comentariosService.listarPorIdeia(ideiaId, req.user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async curtirComentario(@Param('id') id: number, @Request() req) {
    return this.comentariosService.curtirComentario(id, req.user);
  }
}
