import { Controller, Post, Param, Request, UseGuards } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('comentarios')
export class ComentariosLikeController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async curtir(@Param('id') id: number, @Request() req) {
    return this.comentariosService.curtirComentario(id, req.user);
  }
}
