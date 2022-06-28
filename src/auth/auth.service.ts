import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { JwtPayload, Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { CreateParticipanteDto } from '../participante/dto/create-participante.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async getTokens(
    userId: string,
    email: string,
    assembId: string,
  ): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
      assembId,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: 'at-secret',
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: 'rt-secret',
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async cadastroLocal(dto: CreateParticipanteDto): Promise<Tokens> {
    const hash = await argon.hash(dto.password);

    const user = await this.prisma.participante
      .create({
        data: {
          nome: dto.nome,
          email: dto.email,
          hash,
          cpfcnpj: dto.cpfcnpj,
          assembleiaId: dto['assembleiaId'],
        },
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ForbiddenException('Credenciais incorretas');
          }
        }
        throw error;
      });

    const tokens = await this.getTokens(user.id, user.email, user.assembleiaId);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async updateRtHash(userId: string, rt: string): Promise<void> {
    const hash = await argon.hash(rt);
    await this.prisma.participante.update({
      where: {
        id: userId,
      },
      data: {
        hashedRT: hash,
      },
    });
  }

  async loginLocal(dto: CreateParticipanteDto): Promise<Tokens> {
    const user = await this.prisma.participante.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Acesso negado');

    const passwordMatches = await argon.verify(user.hash, dto.password);
    if (!passwordMatches) throw new ForbiddenException('Acesso negado');

    const tokens = await this.getTokens(user.id, user.email, user.assembleiaId);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: string): Promise<boolean> {
    await this.prisma.participante.updateMany({
      where: {
        id: userId,
        hashedRT: {
          not: null,
        },
      },
      data: {
        hashedRT: null,
      },
    });
    return true;
  }

  async refreshTokens(userId: string, rt: string): Promise<Tokens> {
    const user = await this.prisma.participante.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user || !user.hashedRT) throw new ForbiddenException('Acesso negado');

    const rtMatches = await argon.verify(user.hashedRT, rt);
    if (!rtMatches) throw new ForbiddenException('Acesso negado');

    const tokens = await this.getTokens(user.id, user.email, user.assembleiaId);
    await this.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }
}
