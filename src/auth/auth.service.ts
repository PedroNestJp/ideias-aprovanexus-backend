import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private googleClient = new OAuth2Client();

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

  async loginWithGoogle(credential: string) {
    const ticket = await this.googleClient.verifyIdToken({
      idToken: credential,
      audience:
        process.env.VITE_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new UnauthorizedException('Token inválido do Google.');
    }

    const { email, name } = payload;

    if (!email || !name) {
      throw new UnauthorizedException('Informações incompletas do Google.');
    }

    let user = await this.usersService.findByEmail(email);

    if (!user) {
      // Cria usuário novo se não existir
      user = await this.usersService.create({
        nome: name,
        email: email,
        senha: '', // pode deixar vazio ou uma senha aleatória segura
      });
    }

    return this.generateToken(user);
  }

  private generateToken(user: any) {
    const payload = { username: user.nome, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
