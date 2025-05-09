// inova-backend/src/ideias/ideias.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
  Patch,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { IdeiasService } from './ideias.service';
import { CreateIdeiaDto } from './dto/create-ideia.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { getMulterS3Config } from '../aws/s3.config';
import { AuthGuard } from '@nestjs/passport';

@Controller('ideias')
export class IdeiasController {
  constructor(private readonly ideiasService: IdeiasService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('anexo', { storage: getMulterS3Config('anexos-ideias') }),
  )
  async criar(
    @Body() body: CreateIdeiaDto,
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const File = (file as any)?.location;
    const data = {
      ...body,
      anexo: File || null,
    };
    return this.ideiasService.criar(data, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async listar(@Request() req) {
    return this.ideiasService.listar(req.user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async curtir(@Param('id') id: number, @Request() req) {
    return this.ideiasService.curtir(id, req.user);
  }

  // PATCH /ideias/:id/status
  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'))
  async atualizarStatusIdeia(
    @Param('id') id: number,
    @Body('status') status: string,
    @Req() req: any,
  ) {
    const role = req.user?.role;
    if (role !== 'diretor' && role !== 'admin') {
      throw new UnauthorizedException(
        'Apenas diretores ou administradores podem alterar o status.',
      );
    }

    return this.ideiasService.atualizarStatus(id, status);
  }
}
