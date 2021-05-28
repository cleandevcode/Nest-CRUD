import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { SearchService } from './search.service';
import { JwtAuthGuard } from '../core/guards/jwt-auth.guard';
import { KeywordDto } from '../core/dtos/keyword.dto';
import { SearchResult } from '../core/models/search';

@ApiTags('Search')
@Controller('api')
export class SearchController {

  constructor(
    private searchService: SearchService,
  ) {
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('search')
  @ApiOkResponse({ type: Object })
  async loggers(@Query() query: KeywordDto, @Request() request): Promise<SearchResult[]> {
    const result = await this.searchService.find(query.keyword || '');
    if (!result) {
      return null;
    }
    return result;
  }

}

