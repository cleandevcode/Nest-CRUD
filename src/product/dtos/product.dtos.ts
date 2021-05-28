import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import {
  PotencyRank,
  PotencyUnitOfMeasure,
  ProductCategory,
  ProductClass,
  ProductPackSizeUOM,
  ProductStatus,
  ProductStatusReason,
  ProductSubClass,
  ProductType,
  vacCoverage,
} from '../../core/enums/product';
import { AbstractDto } from '../../core/dtos/AbstractDto';
import { PaginationDto } from 'src/core/dtos/pagination.dto';
import { TablePaginationDto } from 'src/core/dtos/table-pagination.dto';

export class ProductDto extends AbstractDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  brandId: string;

  @ApiProperty({ enum: ProductCategory, required: true })
  @IsNotEmpty()
  @IsEnum(ProductCategory)
  category: ProductCategory;

  @ApiProperty({ enum: ProductClass, required: true })
  @IsEnum(ProductClass)
  @IsNotEmpty()
  class: ProductClass;

  @ApiProperty({ enum: ProductSubClass, required: true })
  @IsEnum(ProductSubClass)
  @IsNotEmpty()
  subClass: ProductSubClass;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: ProductType, required: true })
  @IsEnum(ProductType)
  @IsNotEmpty()
  type: ProductType;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  medicalPin: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  province?: string;

  @ApiProperty({ enum: vacCoverage, required: true })
  @IsNotEmpty()
  @IsEnum(vacCoverage)
  vacCoverage: vacCoverage;

  @ApiProperty({ enum: ProductStatus, required: true })
  @IsNotEmpty()
  @IsEnum(ProductStatus)
  status: ProductStatus;

  @ApiProperty({ enum: ProductStatusReason, required: true })
  @IsNotEmpty()
  @IsEnum(ProductStatusReason)
  statusReason: ProductStatusReason;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  sku: string;

  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  medicalListPrice: number;

  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  packSize: number;

  @ApiProperty({ enum: ProductPackSizeUOM, required: true })
  @IsNotEmpty()
  @IsEnum(ProductPackSizeUOM)
  packSizeUOM: ProductPackSizeUOM;

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsNumber()
  cbdMin?: number;

  @ApiProperty({ type: Number, required: false })
  @IsNumber()
  @IsOptional()
  cbdMax?: number;

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsNumber()
  thcMin?: number;

  @ApiProperty({ type: Number, required: false })
  @IsNumber()
  @IsOptional()
  thcMax?: number;

  @ApiProperty({ enum: PotencyUnitOfMeasure, required: false })
  @IsOptional()
  @IsEnum(PotencyUnitOfMeasure)
  potencyUnit?: PotencyUnitOfMeasure;

  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  driedCannabis: number;

  @ApiProperty({ enum: PotencyRank, required: false })
  @IsOptional()
  @IsEnum(PotencyRank)
  thcRank: PotencyRank;

  @ApiProperty({ enum: PotencyRank, required: false })
  @IsOptional()
  @IsEnum(PotencyRank)
  cbdRank: PotencyRank;

  @ApiProperty({ type: String, isArray: true })
  @IsArray()
  @IsNotEmpty()
  conditions: string[];

  @ApiProperty({ type: String, required: false })
  @IsString()
  @Optional()
  reason?: string;
}

export class BrandDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class ProductFilterOptionDto extends PaginationDto {
  @ApiProperty({ enum: ProductClass, isArray: true, required: false })
  @IsArray()
  @IsOptional()
  class?: ProductClass[];

  @ApiProperty({ enum: ProductSubClass, isArray: true, required: false })
  @IsArray()
  @IsOptional()
  subClass?: ProductSubClass[];

  @ApiProperty({ enum: ProductCategory, isArray: true, required: false })
  @IsArray()
  @IsOptional()
  category?: ProductCategory[];

  @ApiProperty({ enum: ProductType, isArray: true, required: false })
  @IsArray()
  @IsOptional()
  type?: ProductType[];

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  province?: string;

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsNumber()
  cbdMin?: number;

  @ApiProperty({ type: Number, required: false })
  @IsNumber()
  @IsOptional()
  cbdMax?: number;

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsNumber()
  thcMin?: number;

  @ApiProperty({ type: Number, required: false })
  @IsNumber()
  @IsOptional()
  thcMax?: number;
}

export class ProductTablePaginationDto extends TablePaginationDto {
  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  province?: string;
}
