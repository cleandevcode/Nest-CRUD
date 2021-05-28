import { ApiProperty } from '@nestjs/swagger';
import { version } from '../../../package.json';

export class HealthResponse {
  @ApiProperty()
  readonly status: boolean;

  @ApiProperty()
  readonly version: string;

  constructor() {
    this.status = true;
    this.version = version;
  }
}
