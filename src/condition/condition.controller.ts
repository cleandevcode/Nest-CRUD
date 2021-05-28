import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ConditionService } from './condition.service';
import { JwtAuthGuard } from '../core/guards/jwt-auth.guard';
import { Condition } from './entities/condition.entity';
import { ConditionDto } from './dtos/condition.dto';

@ApiTags('Conditions')
@Controller('api')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ConditionController {
  constructor(private conditionService: ConditionService) {}

  @Get('conditions')
  @ApiOkResponse({ type: [Condition] })
  async conditions(@Request() request): Promise<string[]> {
    return await this.conditionService.getAll();
  }

  @Post('conditions')
  @ApiOkResponse({ type: [String] })
  async createCondition(
    @Request() request,
    @Body() body: ConditionDto,
  ): Promise<string[]> {
    return await this.conditionService.createCondition(body.conditions);
  }
}
