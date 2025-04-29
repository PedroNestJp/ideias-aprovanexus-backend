import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { email } });
    return user ?? undefined;
  }

  async findById(id: number): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { id } });
    return user ?? undefined;
  }

  async create(data: Partial<User>): Promise<User> {
    if (!data.nome || !data.email || !data.senha) {
      throw new BadRequestException('Dados obrigatórios ausentes');
    }

    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new BadRequestException('E-mail já cadastrado');
    }

    const user = this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }

  async update(id: number, updates: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, updates);
    const user = await this.findById(id);
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }
    return user;
  }
}
