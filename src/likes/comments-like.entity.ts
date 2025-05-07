// src/likes/comentario-like.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Comentario } from '../comentarios/comentario.entity';

@Entity('comentario_likes')
export class ComentarioLike {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Comentario, (comentario) => comentario.likes)
  comentario!: Comentario;

  @ManyToOne(() => User)
  usuario!: User;
}
