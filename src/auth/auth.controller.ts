import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';

import { GetCurrentUserId, GetCurrentUser } from '../shared/decorators';
import { RtGuard, AtGuard } from '../shared/guards';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Tokens } from './types';
import { CreateParticipanteDto } from '../participante/dto/create-participante.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('local/cadastro')
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() dto: CreateParticipanteDto): Promise<Tokens> {
    return this.authService.cadastroLocal(dto);
  }

  @Post('local/login')
  @HttpCode(HttpStatus.OK)
  signinLocal(@Body() dto: CreateParticipanteDto): Promise<Tokens> {
    return this.authService.loginLocal(dto);
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: string): Promise<boolean> {
    return this.authService.logout(userId);
  }

  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
