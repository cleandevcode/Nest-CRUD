import { ApiProperty } from '@nestjs/swagger';

export class KeywordDto {
  @ApiProperty()
  keyword: string;
}
