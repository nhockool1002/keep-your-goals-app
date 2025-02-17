import { Controller, Get } from '@nestjs/common';
import { logger } from '../utils/logger';

@Controller('tests')
export class TestsController {
    @Get()
    getAllGoals() {
        logger.info('Fr NestJS: [API getAllGoals] get success');
        logger.error('Fr NestJS: [API getAllGoals] get error');
        logger.warn('Fr NestJS: [API getAllGoals] get warning');
        return [
        { id: 1, title: 'Learn React Native 1', completed: false },
        { id: 2, title: 'Build a NestJS API 2', completed: true },
        ];
    }
}
