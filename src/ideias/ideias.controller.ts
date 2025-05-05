// inova-backend/src/ideias/ideias.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { IdeiasService } from './ideias.service';
import { CreateIdeiaDto } from './dto/create-ideia.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('ideias')
export class IdeiasController {
  constructor(private readonly ideiasService: IdeiasService) {}

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
  async criar(
    @Body() body: CreateIdeiaDto,
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const data = {
      ...body,
      anexo: file?.filename || null, // Inclui o nome do anexo corretamente
    };
    console.log('File:', file);
    console.log('Data:', data);
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
}
