// inova-backend/src/profile/profile.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PerfilService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async atualizarPerfil(
    userId: number,
    nome?: string,
    foto?: string,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (nome) {
      user.nome = nome;
    }
    if (foto) {
      user.foto = foto;
    }

    return this.usersRepository.save(user);
  }

  async alterarSenha(
    userId: number,
    senhaAtual: string,
    novaSenha: string,
  ): Promise<{ message: string }> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const senhaCorreta = await bcrypt.compare(senhaAtual, user.senha);
    if (!senhaCorreta) {
      throw new Error('Senha atual incorreta');
    }

    const novaSenhaCriptografada = await bcrypt.hash(novaSenha, 10);
    user.senha = novaSenhaCriptografada;
    await this.usersRepository.save(user);

    return { message: 'Senha alterada com sucesso' };
  }
}
