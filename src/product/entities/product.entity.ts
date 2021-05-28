import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, JoinColumn, ManyToOne } from 'typeorm';

import {
  ProductCategory,
  ProductClass,
  ProductSubClass,
  ProductType,
  vacCoverage,
  ProductStatus,
  ProductStatusReason,
  ProductPackSizeUOM,
  PotencyUnitOfMeasure,
  PotencyRank,
} from '../../core/enums/product';
import { Cart } from '../../claim/entities/cart.entity';
import { AbstractEntity } from '../../core/abstract.entity';
import { ProductDto } from '../dtos/product.dtos';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Optional } from '@nestjs/common';
import { Brand } from './brand.entity';

@Entity('product')
export class Product extends AbstractEntity<ProductDto> {
  @ApiProperty({ enum: ProductCategory, required: true })
  @IsNotEmpty()
  @IsEnum(ProductCategory)
  @Column({ type: 'enum', enum: ProductCategory, nullable: true })
  category: ProductCategory;

  @ApiProperty({ enum: ProductClass, required: true })
  @IsEnum(ProductClass)
  @IsNotEmpty()
  @Column({ type: 'enum', enum: ProductClass, nullable: true })
  class: ProductClass;

  @ApiProperty({ enum: ProductSubClass, required: true })
  @IsEnum(ProductSubClass)
  @IsNotEmpty()
  @Column({ type: 'enum', enum: ProductSubClass, nullable: true })
  subClass: ProductSubClass;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar' })
  name: string;

  @ApiProperty({ enum: ProductType, required: true })
  @IsEnum(ProductType)
  @IsNotEmpty()
  @Column({ type: 'enum', enum: ProductType, nullable: true })
  type: ProductType;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  @Column({ type: 'varchar' })
  medicalPin: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  @Column({ type: 'varchar', nullable: true, default: 'Other' })
  province?: string;

  @ApiProperty({ enum: vacCoverage, required: true })
  @IsNotEmpty()
  @IsEnum(vacCoverage)
  @Column({ type: 'enum', enum: vacCoverage, nullable: true })
  vacCoverage: vacCoverage;

  @ApiProperty({ enum: ProductStatus, required: true })
  @IsNotEmpty()
  @IsEnum(ProductStatus)
  @Column({ type: 'enum', enum: ProductStatus, nullable: true })
  status: ProductStatus;

  @ApiProperty({ enum: ProductStatusReason, required: true })
  @IsNotEmpty()
  @IsEnum(ProductStatusReason)
  @Column({ type: 'enum', enum: ProductStatusReason, nullable: true })
  statusReason: ProductStatusReason;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  @Column({ type: 'varchar' })
  sku: string;

  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.1)
  @Column({ type: 'float' })
  medicalListPrice: number;

  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  @Column({ type: 'float' })
  packSize: number;

  @ApiProperty({ enum: ProductPackSizeUOM, required: true })
  @IsNotEmpty()
  @IsEnum(ProductPackSizeUOM)
  @Column({
    type: 'enum',
    enum: ProductPackSizeUOM,
    nullable: true,
    default: ProductPackSizeUOM.g,
  })
  packSizeUOM: ProductPackSizeUOM;

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsNumber()
  @Column({ type: 'float', nullable: true, default: 0 })
  cbdMin?: number;

  @ApiProperty({ type: Number, required: false })
  @IsNumber()
  @IsOptional()
  @Column({ type: 'float', nullable: true, default: 0 })
  cbdMax?: number;

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsNumber()
  @Column({ type: 'float', nullable: true, default: 0 })
  thcMin?: number;

  @ApiProperty({ type: Number, required: false })
  @IsNumber()
  @IsOptional()
  @Column({ type: 'float', nullable: true, default: 0 })
  thcMax?: number;

  @ApiProperty({ enum: PotencyUnitOfMeasure, required: false })
  @IsOptional()
  @IsEnum(PotencyUnitOfMeasure)
  @Column({
    type: 'varchar',
    nullable: true,
    default: PotencyUnitOfMeasure.mgml,
  })
  potencyUnit?: PotencyUnitOfMeasure;

  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty()
  @IsString()
  @Column({ type: 'float' })
  driedCannabis: number;

  @ApiProperty({ enum: PotencyRank, required: false })
  @IsOptional()
  @IsEnum(PotencyRank)
  @Column({
    type: 'enum',
    enum: PotencyRank,
    nullable: true,
    default: PotencyRank.balanced,
  })
  thcRank?: PotencyRank;

  @ApiProperty({ enum: PotencyRank, required: false })
  @IsOptional()
  @IsEnum(PotencyRank)
  @Column({
    type: 'enum',
    enum: PotencyRank,
    nullable: true,
    default: PotencyRank.balanced,
  })
  cbdRank: PotencyRank;

  @ApiProperty({ type: String, isArray: true })
  @IsArray()
  @Column({ type: 'simple-array', default: null })
  conditions: string[];

  @ApiProperty({ type: String, required: false })
  @IsString()
  @Optional()
  @Column({ type: 'varchar', nullable: true, default: 'Unknown' })
  reason?: string;

  @ManyToOne(() => Brand)
  @JoinColumn()
  brand: Brand;

  @OneToMany(() => Cart, (cart) => cart.product)
  carts: Cart[];
}
