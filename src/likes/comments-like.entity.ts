// src/likes/comentario-like.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Comentario } from '../comentarios/comentario.entity';

@Entity('comentario_likes')
export class ComentarioLike {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { eager: true })
  usuario!: User;

  @ManyToOne(() => Comentario, { eager: true })
  comentario!: Comentario;
}
