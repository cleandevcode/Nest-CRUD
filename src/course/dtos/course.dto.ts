import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CourseDto {
  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsString()
  description: string;
}
