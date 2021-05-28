import { ApiProperty } from '@nestjs/swagger';

import { PaginationDto } from '../../core/dtos/pagination.dto';

export class TablePaginationDto extends PaginationDto {
  @ApiProperty({ required: false })
  keyword: string;
}
