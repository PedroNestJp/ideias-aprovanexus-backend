// inova-backend/src/ideias/ideia.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('ideias')
export class Ideia {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  titulo!: string;

  @Column('text')
  descricao!: string;

  @Column()
  instituicao!: string;

  @Column({ default: 'Cadastrado' })
  status!: string; // Cadastrado, Em desenvolvimento, Já existe, Concluído

  @Column({ default: 0 })
  likes!: number;

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  usuario!: User;

  @CreateDateColumn()
  criadoEm!: Date;

  @Column({ nullable: true })
  anexo!: string;
}
