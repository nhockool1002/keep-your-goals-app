import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { logger } from "../utils/logger";
import { InternalServerErrorException, BadRequestException, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(lmid: string, email: string, password: string, username?: string) {
    try {
      logger.info(`>> Fr NestJS [Auth Service][Register] ${lmid}: email ${email}, username ${username} ready to create user account`);
  
      if (!password) {
        throw new Error(`${lmid}: Password is required`);
      }
  
      if (username) {
        const existingUser = await this.prisma.user.findUnique({
          where: { username },
        });
        if (existingUser) {
          throw new BadRequestException(`${lmid}: Username already exists`);
        }
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      logger.info(`>> Fr NestJS [Auth Service][Register] ${lmid}: generate hashed password success`);
  
      const user = await this.prisma.user.create({
        data: { 
          email, 
          username, 
          passwordHash: hashedPassword 
        },
      });
  
      const token = this.jwtService.sign({ userId: user.id, email: user.email, isAdmin: user.isAdmin });
  
      logger.info(`> Fr NestJS [Auth Service][Register] ${lmid}: User ${username} created successful.`);
      return { 
        accessToken: token, 
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          createdAt: user.createdAt
        }
      };
    } catch (error) {
      logger.error(`>>> Fr NestJS [Auth Service][Register] ${lmid}: Error during registration - ${error.message}`);
      
      if (error.code === 'P2002') {
        throw new BadRequestException(`${lmid}: Email or Username already exists`);
      }
  
      throw new InternalServerErrorException(`${lmid}: ${error.message}`);
    }
  }

  async login(lmid: string, email: string, password: string) {
    try {
      logger.info(`>> Fr NestJS [Auth Service][Login] ${lmid}: email ${email} attempting to log in`);
  
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      if (!user) {
        throw new UnauthorizedException(`${lmid}: Invalid credentials`);
      }
  
      if (!user.passwordHash) {
        throw new UnauthorizedException(`${lmid}: User registered via social login. Please use the respective provider to log in.`);
      }
  
      const passwordValid = await bcrypt.compare(password, user.passwordHash || '');
      if (!passwordValid) {
        throw new UnauthorizedException(`${lmid}: Invalid credentials`);
      }
  
      const token = this.jwtService.sign({ userId: user.id, email: user.email, isAdmin: user.isAdmin });
      logger.info(`>> Fr NestJS [Auth Service][Login] ${lmid}: user ${user.username} login successful.`);
      return {
        accessToken: token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          createdAt: user.createdAt
        }
      };
    } catch (error) {
      logger.error(`>>> Fr NestJS [Auth Service][Login]${lmid}: Error during login - ${error.message}`);
      throw new InternalServerErrorException(`${lmid}: ${error.message}`);
    }
  }
  

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
