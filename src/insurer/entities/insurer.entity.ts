import { ApiProperty } from '@nestjs/swagger';
import { AbstractEntity } from 'src/core/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity('insurer')
export class Insurer extends AbstractEntity {
  @ApiProperty()
  @Column({ type: 'varchar', length: 2, nullable: true })
  carrierId: string;

  @ApiProperty()
  @Column({ type: 'varchar', unique: true, nullable: true })
  carrierName: string;

  @ApiProperty()
  @Column({ nullable: true })
  adjudicatorIIN: string;

  @ApiProperty()
  @Column({ nullable: true })
  adjudicatorName: string;
}
