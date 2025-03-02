import { Injectable } from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { PrismaService } from '../prisma/prisma.service';
import { InternalServerErrorException, ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
import { logger } from "../utils/logger";
import { GoalType, GoalStatus } from '@prisma/client';

@Injectable()
export class GoalsService {
  constructor(private prisma: PrismaService) {}

  async getUserGoals(lmid: string, requestingUser: { userId: string }, userId?: string) {
    try {
      const userFromDb = await this.prisma.user.findUnique({
        where: { id: requestingUser.userId },
        select: { isAdmin: true },
      });
  
      if (!userFromDb) {
        logger.error(`>>> Fr NestJS [Goals Service][getUserGoals] ${lmid}: userId ${userId} not found`);
        throw new ForbiddenException(`${lmid}: User not found`);
      }
  
      const isAdmin = userFromDb.isAdmin;
  
      if (userId && !isAdmin) {
        logger.error(`>>> Fr NestJS [Goals Service][getUserGoals] ${lmid}: userId ${userId}, requestingUser IsAdmin ${isAdmin}`);
        throw new ForbiddenException(`${lmid}: Only admins can access other users' goals`);
      }
  
      const whereCondition = { userId: userId || requestingUser.userId };
  
      const goals = await this.prisma.goal.findMany({
        where: whereCondition,
        select: {
          id: true,
          userId: true,
          type: true,
          title: true,
          description: true,
          startDate: true,
          endDate: true,
          status: true,
          quantity: true,
          amount: true,
          current: true,
          createdAt: true,
          updatedAt: true,
        },
      });
  
      const totalRows = await this.prisma.goal.count({ where: whereCondition });
      if (isAdmin) {
        logger.info(`>> Fr NestJS [Goals Service][getUserGoals] ${lmid}: Get goals from admin, current goals completed`);
      } else {
        logger.info(`>> Fr NestJS [Goals Service][getUserGoals] ${lmid}: Get goals completed!`);
      }
      
      return { totalRows, goals };
    } catch (error) {
      logger.error(`>>> Fr NestJS [Goals Service][getUserGoals] ${lmid}: Internal Exception ${error.message}`);
      throw new InternalServerErrorException(error.message);
    }
  }

  async create(lmid: string, userId: string, data: CreateGoalDto) {
    if (!Object.values(GoalType).includes(data.type as GoalType)) {
      logger.error(`>>> Fr NestJS [Goals Service][Create] ${lmid}: Invalid goal type '${data.type}'. Allowed values: TODOANYTHING, TODOQUANTITY, SAVEMONEY`);
      throw new BadRequestException(`${lmid}: Invalid goal type '${data.type}'. Allowed values: TODOANYTHING, TODOQUANTITY, SAVEMONEY`);
    }

    return this.prisma.$transaction(async (prisma) => {
      logger.info(`>> Fr NestJS [Goals Service][create] ${lmid}: Start create goals`);
      try {
        const goal = await prisma.goal.create({
          data: {
            userId: userId,
            type: data.type,
            title: data.title,
            description: data.description,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            status: "TODO",
            quantity: data.quantity,
            amount: data.amount,
            current: 0.0,
            atmm: 0.0,
          },
        });

        logger.info(`>> Fr NestJS [Goals Service][create] ${lmid}: Start create goals history`);
        await prisma.goalHistory.create({
          data: {
            goalId: goal.id,
            status: goal.status,
          },
        });

        logger.info(`>> Fr NestJS [Goals Service][create] ${lmid}: Start create goals statistics`);
        await prisma.goalStatistics.create({
          data: {
            goalId: goal.id,
            progress: 0.0,
          },
        });

        logger.info(`>> Fr NestJS [Goals Service][create] ${lmid}: Create goals completed`);
        return goal;
      } catch (error) {
        logger.error(`>>> Fr NestJS [Goals Service][create] ${lmid}: Failed to create goal: ${error.message}`);
        throw new Error(`${lmid}: Failed to create goal: ${error.message}`);
      }
    });
  }

  findAll() {
    return `This action returns all goals`;
  }

  findOne(id: number) {
    return `This action returns a #${id} goal`;
  }

  async update(lmid: string, goalId: string, userId: string, isAdmin: boolean, data: UpdateGoalDto) {
    logger.info(`>> Fr NestJS [Goals Service][update] ${lmid}: Start update goal ${goalId}`);
    return this.prisma.$transaction(async (prisma) => {
      const existingGoal = await prisma.goal.findUnique({
        where: { id: goalId },
        include: { statistics: true },
      });

      if (!existingGoal) {
        logger.error(`>>> Fr NestJS [Goals Service][update] ${lmid}: Goals with ID ${goalId} not found`);
        throw new NotFoundException(`${lmid}: Goal with ID ${goalId} not found`);
      }

      if (!isAdmin && existingGoal.userId !== userId) {
        logger.error(`>>> Fr NestJS [Goals Service][update] ${lmid}: You do not have permission to update this goal`);
        throw new ForbiddenException(`${lmid}: You do not have permission to update this goal`);
      }

      const updates: any = {};
      let updateStatusHistory = false;

      if (data.endDate && data.endDate !== "") {
        const newEndDate = new Date(data.endDate);
        const startDate = new Date(existingGoal.startDate);
  
        if (newEndDate <= startDate) {
          logger.error(`>>> Fr NestJS [Goals Service][update] ${lmid}: endDate must be greater than startDate.`);
          throw new BadRequestException(`${lmid}: endDate must be greater than startDate.`);
        }
        updates.endDate = newEndDate;
      }

      if (data.status !== undefined && String(data.status).trim() === "") {
        logger.info(`>> Fr NestJS [Goals Service][update] ${lmid}: Skipping status update as it's empty.`);
      } else if (data.status !== undefined && !Object.values(GoalStatus).includes(data.status as GoalStatus)) {
        logger.error(`>>> Fr NestJS [Goals Service][update] ${lmid}: Invalid status: '${data.status}'. Allowed values: ${Object.values(GoalStatus).join(", ")}`);
        throw new BadRequestException(`Invalid status: '${data.status}'. Allowed values: ${Object.values(GoalStatus).join(", ")}`);
      } else if (data.status !== undefined) {
        logger.info(`>> Fr NestJS [Goals Service][update] ${lmid}: Update Status`);
        updates.status = data.status;
        updateStatusHistory = true;
      }

      if (data.description !== undefined && data.description !== null) updates.description = data.description;
      if (data.current !== undefined && data.current !== null) updates.current = data.current;
      if (data.atmm !== undefined && data.atmm !== null) updates.atmm = data.atmm;

      logger.info(`>> Fr NestJS [Goals Service][update] ${lmid}: Completed check update description, current atmm`);

      if (Object.keys(updates).length === 0) {
        logger.error(`>>> Fr NestJS [Goals Service][update] ${lmid}: No valid fields to update`);
        throw new BadRequestException(`${lmid}: No valid fields to update`);
      }

      const updatedGoal = await prisma.goal.update({
        where: { id: goalId },
        data: updates,
      });

      await prisma.goalHistory.create({
        data: {
          goalId,
          status: updatedGoal.status,
          note: data.note ?? "Updated goal",
        },
      });

      if (existingGoal.statistics) {
        let newProgress = 0.0;

        if (existingGoal.type === GoalType.TODOQUANTITY && updatedGoal.quantity) {
          newProgress = ((updatedGoal.current ?? 0) / updatedGoal.quantity) * 100;
        }

        if (existingGoal.type === GoalType.SAVEMONEY && updatedGoal.amount) {
          newProgress = ((updatedGoal.current ?? 0) / updatedGoal.amount) * 100;
        }

        newProgress = parseFloat(newProgress.toFixed(2));

        await prisma.goalStatistics.updateMany({
          where: { goalId },
          data: { progress: newProgress },
        });
      }
      logger.info(`>> Fr NestJS [Goals Service][update] ${lmid}: Update goals ${goalId} completed.`);
      return updatedGoal;
    });
  }

  async remove(lmid: string, goalId: number, userId: string, isAdmin: boolean) {
    logger.info(`>> Fr NestJS [Goals Service][remove] ${lmid}: Start remove goal ${goalId}`);
    return this.prisma.$transaction(async (prisma) => {

      const existingGoal = await prisma.goal.findUnique({
        where: { id: goalId.toString() },
      });

      if (!existingGoal) {
        logger.error(`>>> Fr NestJS [Goals Service][remove] ${lmid}: Goal with ID ${goalId} not found`);
        throw new NotFoundException(`Goal with ID ${goalId} not found`);
      }

      if (!isAdmin && existingGoal.userId !== userId) {
        logger.error(`>>> Fr NestJS [Goals Service][remove] ${lmid}: You do not have permission to delete this goal ${goalId}`);
        throw new ForbiddenException("You do not have permission to delete this goal");
      }
      
      logger.info(`>> Fr NestJS [Goals Service][remove] ${lmid}: Start remove goalHistory of goal ${goalId}`);
      await prisma.goalHistory.deleteMany({ where: { goalId: existingGoal.id } });
      logger.info(`>> Fr NestJS [Goals Service][remove] ${lmid}: End remove goalHistory of goal ${goalId}`);

      logger.info(`>> Fr NestJS [Goals Service][remove] ${lmid}: Start remove goalStatic goal ${goalId}`);
      await prisma.goalStatistics.deleteMany({ where: { goalId: existingGoal.id } });
      logger.info(`>> Fr NestJS [Goals Service][remove] ${lmid}: End remove goalStatic goal ${goalId}`);

      logger.info(`>> Fr NestJS [Goals Service][remove] ${lmid}: Start remove goalLabel goal ${goalId}`);
      await prisma.goal.update({
        where: { id: existingGoal.id },
        data: { labels: { set: [] } },
      });
      logger.info(`>> Fr NestJS [Goals Service][remove] ${lmid}: End remove goalLabel goal ${goalId}`);

      logger.info(`>> Fr NestJS [Goals Service][remove] ${lmid}: Start remove goal ${goalId}`);
      await prisma.goal.delete({ where: { id: existingGoal.id } });
      logger.info(`>> Fr NestJS [Goals Service][remove] ${lmid}: End remove goal ${goalId}`);

      logger.info(`>> Fr NestJS [Goals Service][update] ${lmid}: Remove goal ${goalId} completed`);
      return { message: `Goal with ID ${goalId} deleted successfully` };
    });
  }
}
