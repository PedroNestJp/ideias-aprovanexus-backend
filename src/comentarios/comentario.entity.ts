import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Ideia } from '../ideias/ideia.entity';
import { User } from '../users/user.entity';

@Entity('comentarios')
export class Comentario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  texto!: string;

  @ManyToOne(() => Ideia, (ideia) => ideia.id)
  ideia!: Ideia;

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  autor!: User;

  @CreateDateColumn()
  criadoEm!: Date;

  @Column({ nullable: true })
  anexo!: string;

  @Column({ default: 0 })
  likes!: number;
}
