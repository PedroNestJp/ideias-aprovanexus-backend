import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

export type UserRole = 'usuario' | 'diretor' | 'admin';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  senha!: string;

  @CreateDateColumn()
  criadoEm!: Date;

  @Column({ nullable: true })
  foto?: string;

  @Column({ default: 'usuario' })
  role?: UserRole;
}
