// inova-backend/src/auth/auth.service.ts
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
    const payload = {
      username: user.nome,
      sub: user.id,
      foto: user.foto || null,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(data: any) {
    const existingUser = await this.usersService.findByEmail(data.email);

    if (existingUser) {
      // Se já existe, apenas gerar login normalmente
      return this.login(existingUser);
    }

    const newUserData: any = {
      nome: data.nome,
      email: data.email,
      senha: await bcrypt.hash(data.senha || Math.random().toString(36), 10),
      role: 'usuario',
    };

    // Se tiver foto (login pelo Google), salva
    if (data.foto) {
      newUserData.foto = data.foto;
    }

    const newUser = await this.usersService.create(newUserData);
    return this.login(newUser);
  }

  async loginComGoogle(idToken: string) {
    const ticket = await this.googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new UnauthorizedException('Invalid Google token');
    }

    const email = payload.email;
    const nome = payload.name;
    const foto = payload.picture;

    // Verifica se já existe
    if (!email) {
      throw new UnauthorizedException('Email is missing in Google token');
    }

    let user = await this.usersService.findByEmail(email);

    if (!user) {
      // Cria usuário com senha aleatória (não será usada)
      user = await this.usersService.create({
        nome,
        email,
        senha: await bcrypt.hash(Math.random().toString(36), 10),
        foto,
        role: 'usuario',
      });
    }

    const token = this.jwtService.sign({
      username: user.nome,
      sub: user.id,
      foto: user.foto,
      role: user.role,
    });

    return { access_token: token, user };
  }
}
