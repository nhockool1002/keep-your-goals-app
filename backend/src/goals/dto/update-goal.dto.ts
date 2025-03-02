import { IsOptional, IsInt, IsNumber, IsDateString, IsEnum, IsString, ValidateIf } from 'class-validator';
import { GoalStatus } from '@prisma/client';

export class UpdateGoalDto {
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ValidateIf((o) => o.status !== undefined && o.status !== "")
  @IsEnum(GoalStatus)
  status?: GoalStatus;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  current?: number;

  @IsOptional()
  @IsNumber()
  atmm?: number;

  @IsOptional()
  @IsString()
  note?: string;
}
