import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Ideia } from '../ideias/ideia.entity';
import { User } from '../users/user.entity';

@Entity('ideia_likes')
export class IdeiaLike {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Ideia, (ideia) => ideia.likes)
  ideia!: Ideia;

  @ManyToOne(() => User)
  usuario!: User;
}
