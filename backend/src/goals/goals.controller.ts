import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { AuthGuard } from '../auth/auth.guard';
import { AuthenticatedRequest } from '../auth/auth-request.interface';
import { logger } from "../utils/logger";
import { generateRandomCode } from '../utils/func';

@Controller('v1/goals')
@UseGuards(AuthGuard)
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get()
  async getGoals(@Req() req: AuthenticatedRequest, @Query('userId') userId?: string) {
    const code = generateRandomCode();
    logger.info(`>> Fr NestJS [Goals Controller][getGoals] ${code}: userId ${userId}`);
    return this.goalsService.getUserGoals(code, req.user!, userId);
  }

  @Post()
  async create(@Body() createGoalDto: CreateGoalDto, @Req() req) {
    const code = generateRandomCode();
    const userId = req.user.userId;
    logger.info(`>> Fr NestJS [Goals Controller][create] ${code}: userId ${userId}`);
    return this.goalsService.create(code, userId, createGoalDto);
  }

  @Get()
  findAll() {
    return this.goalsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.goalsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGoalDto: UpdateGoalDto, @Req() req) {
    const userId = req.user.userId;
    const isAdmin = req.user.isAdmin;
    const code = generateRandomCode();
    logger.info(`>> Fr NestJS [Goals Controller][update] ${code}: userId ${userId} isAdmin ${isAdmin}`);
    return this.goalsService.update(code, id, userId, isAdmin, updateGoalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @Req() req) {
    const userId = req.user.userId;
    const isAdmin = req.user.isAdmin;
    const code = generateRandomCode();
    logger.info(`>> Fr NestJS [Goals Controller][remove] ${code}: userId ${userId} isAdmin ${isAdmin}`);
    return this.goalsService.remove(code, id, userId, isAdmin);
  }
}
