import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, senha: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(senha, user.senha))) {
      const { senha, ...resto } = user;
      return resto;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.nome, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(data: any) {
    const hashedPassword = await bcrypt.hash(data.senha, 10);
    const newUser = await this.usersService.create({
      ...data,
      senha: hashedPassword,
    });
    return this.login(newUser);
  }
}
