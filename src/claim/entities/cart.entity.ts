import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Product } from '../../product/entities/product.entity';
import { Claim } from './claim.entity';
import { CartDto } from '../dtos/claim.dto';
import { AbstractEntity } from '../../core/abstract.entity';

@Entity('cart')
export class Cart extends AbstractEntity<CartDto> {
  @ApiProperty()
  @Column()
  quantity: number;

  @ManyToOne(() => Product, (product) => product.carts)
  product: Product;

  @ManyToOne(() => Claim, (claim) => claim.carts)
  claim: Claim;

  toCartDto(): CartDto {
    return {
      quantity: this.quantity,
      product: this.product.id,
      id: this.id,
    };
  }
}
