import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Delete,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  Ip,
} from '@nestjs/common';
import { isNumber, isNumberString } from 'class-validator';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';

import { ConditionService } from '../condition/condition.service';
import { ProductService } from './product.service';
import { ActionService } from '../action/action.service';
import { Product } from './entities/product.entity';
import { Brand } from './entities/brand.entity';
import {
  BrandDto,
  ProductDto,
  ProductFilterOptionDto,
  ProductTablePaginationDto,
} from './dtos/product.dtos';
import { SuccessResponse } from '../core/models/success-response';
import { JwtAuthGuard } from '../core/guards/jwt-auth.guard';
import { RolesGuard } from '../core/guards/roles.guard';
import { defaultTakeCount } from '../core/constants/base.constant';
import { PaginatorDto } from '../core/dtos/paginator.dto';
import { TablePaginationDto } from '../core/dtos/table-pagination.dto';
import { Roles } from '../core/decorators/roles.decorator';
import { UserRole } from '../core/enums/user';
import { ActionType, ActionContentType } from '../core/enums/action';
import { ActionReasonDto } from '../action/dtos/action.dto';
import { validateProduct } from '../core/validation/product';

const ipaddr = require('ipaddr.js');

@ApiTags('Product')
@Controller('api')
export class ProductController {
  constructor(
    private conditionService: ConditionService,
    private productService: ProductService,
    private actionService: ActionService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('products/filter')
  @ApiOkResponse({ type: [Product] })
  async filter(
    @Request() request,
    @Body() body: ProductFilterOptionDto,
  ): Promise<PaginatorDto<Product>> {
    const [data, count] = await this.productService.filterProducts(body);
    return { data, count };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Admin])
  @Post('products')
  @ApiOkResponse({ type: Product })
  async create(
    @Request() request,
    @Body() body: ProductDto,
    @Ip() ip: string,
  ): Promise<Product> {
    const validProduct = await validateProduct(body);
    await this.conditionService.createCondition(validProduct.conditions);
    const product = await this.productService.createProduct(validProduct);
    const ipAddress = ipaddr.process(ip);

    await this.actionService.createAction(
      {
        id: request.user.id,
        user: request.user.id,
        type: ActionType.Create,
        contentType: ActionContentType.Product,
        content: {
          id: product.id,
          name: product.name,
          pin: product.medicalPin,
          reason: body.reason || 'Unknown',
        },
      },
      ipAddress.octets.join('.'),
    );
    return product;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('products/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Product })
  async productDetail(
    @Request() request,
    @Param('id') id: string,
  ): Promise<Product> {
    if (!isNumberString(id)) {
      throw new BadRequestException('Could not find requested product.');
    }
    return this.productService.findProductById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('products')
  @ApiOkResponse({ type: [Product] })
  async products(
    @Query() query: ProductTablePaginationDto,
    @Request() request,
  ): Promise<PaginatorDto<Product>> {
    let sortBy = query.sortBy;

    if (typeof query.sortBy === 'string') sortBy = [query.sortBy];

    const [data, count] = await this.productService.findProducts(
      query.skip || 0,
      query.take || defaultTakeCount,
      query.keyword || '',
      query.province,
      sortBy,
    );
    return { data, count };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Admin])
  @Delete('products/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  async delete(
    @Request() request,
    @Param('id') id,
    @Ip() ip: string,
    @Body() body: ActionReasonDto,
  ): Promise<SuccessResponse> {
    const product = await this.productService.findProductById(id);
    const ipAddress = ipaddr.process(ip);

    await this.actionService.createAction(
      {
        id: request.user.id,
        user: request.user.id,
        type: ActionType.Delete,
        contentType: ActionContentType.Product,
        content: {
          id: product.id,
          name: product.name,
          pin: product.medicalPin,
          reason: body.reason || 'Unknown',
        },
      },
      ipAddress.octets.join('.'),
    );

    return await this.productService.deleteProduct(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Admin])
  @Put('products/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Product })
  async update(
    @Request() request,
    @Param('id') id: string,
    @Body() body: ProductDto,
    @Ip() ip: string,
  ): Promise<Product> {
    if (!isNumberString(id)) {
      throw new BadRequestException('Invalid product id!');
    }
    const validProduct = await validateProduct({ ...body, id });
    await this.conditionService.createCondition(validProduct.conditions);
    const product = await this.productService.updateProduct(id, validProduct);
    const ipAddress = ipaddr.process(ip);

    await this.actionService.createAction(
      {
        id: request.user.id,
        user: request.user.id,
        type: ActionType.Update,
        contentType: ActionContentType.Product,
        content: {
          id: product.id,
          name: product.name,
          pin: product.medicalPin,
          reason: body.reason || 'Unknown',
        },
      },
      ipAddress.octets.join('.'),
    );
    return product;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('brands/all')
  @ApiOkResponse({ type: [Brand] })
  async allBrands(@Request() request): Promise<Brand[]> {
    return this.productService.getAllBrands();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Admin])
  @Post('brands')
  @ApiOkResponse({ type: Brand })
  async createBrand(
    @Request() request,
    @Body() body: BrandDto,
    @Ip() ip: string,
  ): Promise<Brand> {
    if (!body.name || body.name === '') {
      throw new BadRequestException('Brand name required!');
    }
    const brand = await this.productService.creatBrand(body.name);
    const ipAddress = ipaddr.process(ip);

    await this.actionService.createAction(
      {
        id: request.user.id,
        user: request.user.id,
        type: ActionType.Create,
        contentType: ActionContentType.Brand,
        content: {
          id: brand.id,
          name: brand.name,
          reason: body.reason || 'Unknown',
        },
      },
      ipAddress.octets.join('.'),
    );
    return brand;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Admin])
  @Delete('brands/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  async deleteBrand(
    @Request() request,
    @Param('id') id,
    @Ip() ip: string,
    @Body() body: ActionReasonDto,
  ): Promise<SuccessResponse> {
    const brand = await this.productService.findBrandById(id);
    const ipAddress = ipaddr.process(ip);

    await this.actionService.createAction(
      {
        id: request.user.id,
        user: request.user.id,
        type: ActionType.Delete,
        contentType: ActionContentType.Product,
        content: {
          id: brand.id,
          name: brand.name,
          reason: body.reason || 'Unknown',
        },
      },
      ipAddress.octets.join('.'),
    );
    return await this.productService.deleteBrand(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('brands/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Brand })
  async brandDetail(
    @Request() request,
    @Param('id') id: string,
  ): Promise<Brand> {
    if (!isNumberString(id)) {
      throw new BadRequestException('Could not find requested brand.');
    }

    return this.productService.findBrandById(id);
  }
}
