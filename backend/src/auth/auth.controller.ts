import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { logger } from "../utils/logger";

@Controller('v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('username') username?: string
  ) {
    logger.info(`Fr NestJS [Auth Controller][Register]: email ${email}, username ${username}`);
    return this.authService.register(email, password, username);
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string
  ) {
    logger.info(`Fr NestJS [Auth Controller][Login]: email ${email}`);
    return this.authService.login(email, password);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
