import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';
import { GoalType, GoalStatus } from '@prisma/client';

export class CreateGoalDto {
  @IsNotEmpty()
  @IsEnum(GoalType)
  type: GoalType;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Transform(({ value }) => new Date(value))
  @IsNotEmpty()
  @IsDate()
  startDate: Date;

  @Transform(({ value }) => new Date(value))
  @IsNotEmpty()
  @IsDate()
  endDate: Date;

  @Transform(({ value }) => (value === "" ? GoalStatus.TODO : value))
  @IsEnum(GoalStatus)
  status: string;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsNumber()
  current?: number;

  @IsOptional()
  @IsNumber()
  atmm?: number;
}
