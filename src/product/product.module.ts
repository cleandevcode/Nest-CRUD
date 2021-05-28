import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConditionModule } from '../condition/condition.module';
import { ActionModule } from '../action/action.module';

import { Product } from './entities/product.entity';
import { Brand } from './entities/brand.entity';

import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Brand]),
    ConditionModule,
    ActionModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
