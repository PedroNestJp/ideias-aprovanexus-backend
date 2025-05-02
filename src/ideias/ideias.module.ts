import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeiasController } from './ideias.controller';
import { IdeiasService } from './ideias.service';
import { Ideia } from './ideia.entity';
import { IdeiaLike } from '../likes/ideia-like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ideia, IdeiaLike])],
  controllers: [IdeiasController],
  providers: [IdeiasService],
})
export class IdeiasModule {}
