import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import { Product } from './entities/product.entity';
import { Brand } from './entities/brand.entity';
import { ProductDto, ProductFilterOptionDto } from './dtos/product.dtos';
import { SuccessResponse } from '../core/models/success-response';
import { getFromDto, validateSortOption } from '../core/utils/repository.util';
import { ProductSortKey } from 'src/core/enums/product';
import { SortOrder } from 'src/core/enums/base';
import { defaultTakeCount } from 'src/core/constants/base.constant';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  async createProduct(productDto: ProductDto) {
    const product = getFromDto<Product>(productDto, new Product());
    const brand = await this.findBrandById(productDto.brandId);
    product.brand = brand;
    const added = await this.productRepository.save(product);
    return this.findProductById(added.id);
  }

  async updateProduct(productId: string, data: ProductDto): Promise<Product> {
    let product = await this.findProductById(productId);
    if (!product) {
      throw new BadRequestException('Unable to update non-existing product.');
    }
    product = getFromDto<Product>(data, product);

    if (data.brandId) {
      const brand = await this.brandRepository.findOne({
        where: { id: data.brandId },
      });
      product.brand = brand;
    }

    product.id = productId;

    await this.productRepository.save(product);
    return this.findProductById(product.id);
  }

  async filterProducts(
    filterOption: ProductFilterOptionDto,
  ): Promise<[Product[], number]> {
    const skip = filterOption.skip || 0;
    const take = filterOption.take || defaultTakeCount;
    const type = filterOption.type;
    const productClass = filterOption.class;
    const productSubClass = filterOption.subClass;
    const category = filterOption.category;
    const province = filterOption.province;
    const cbdMin = filterOption.cbdMin;
    const cbdMax = filterOption.cbdMax;
    const thcMin = filterOption.thcMin;
    const thcMax = filterOption.thcMax;

    const keyword = '';

    const whereClause = `(product.name ilike :keyword or product.medicalPin ilike :keyword or product.sku::text ilike :keyword or brand.name::text ilike :keyword)`;

    return await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.brand', 'brand')
      .where(whereClause, { keyword: `%${keyword}%` })
      .andWhere(type ? 'product.type in (:...type)' : 'TRUE', { type })
      .andWhere(category ? 'product.category in (:...category)' : 'TRUE', {
        category,
      })
      .andWhere(productClass ? 'product.class in (:...productClass)' : 'TRUE', {
        productClass,
      })
      .andWhere(
        productSubClass ? 'product.subClass in (:...productSubClass)' : 'TRUE',
        { productSubClass },
      )
      .andWhere(
        new Brackets((qb) => {
          if (province) {
            qb.where('product.province is null').orWhere(
              `product.province = '${province}'`,
            );
          } else {
            qb.where('product.province is null').orWhere(
              `product.province is not null`,
            );
          }
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          if (!cbdMin && !cbdMax) {
            qb.where('product.cbdMin is null').orWhere(
              `product.cbdMin is not null`,
            );
          } else {
            qb.where('product.cbdMin < :cbdMax', {
              cbdMax: cbdMax || 100,
            }).andWhere('product.cbdMax > :cbdMin', { cbdMin: cbdMin || 0 });
          }
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          if (!thcMin && !thcMax) {
            qb.where('product.thcMin is null').orWhere(
              `product.thcMin is not null`,
            );
          } else {
            qb.where('product.thcMin < :thcMax', {
              thcMax: thcMax || 100,
            }).andWhere('product.thcMax > :thcMin', { thcMin: thcMin || 0 });
          }
        }),
      )
      .addOrderBy('product.createdAt', 'ASC')
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  async findProducts(
    skip: number,
    take: number,
    keyword = '',
    province: string | null,
    sortBy: string[] = [],
  ): Promise<[Product[], number]> {
    const whereClause = `(product.name ilike :keyword or product.medicalPin ilike :keyword or product.sku::text ilike :keyword or brand.name::text ilike :keyword)`;
    const orderQuery = {};

    let sortInfo;

    if (sortBy.length > 0) {
      sortBy.map((item) => {
        sortInfo = validateSortOption(ProductSortKey, item);
        switch (sortInfo.key) {
          case ProductSortKey.id:
            orderQuery['product.id'] = sortInfo.order;
            break;
          case ProductSortKey.CreateAt:
            orderQuery['product.createdAt'] = sortInfo.order;
            break;
          case ProductSortKey.name:
            orderQuery['product.name'] = sortInfo.order;
            break;
          case ProductSortKey.brand:
            orderQuery['brand.name'] = sortInfo.order;
            break;
          case ProductSortKey.sku:
            orderQuery['product.sku'] = sortInfo.order;
            break;
          case ProductSortKey.cbdMin:
            orderQuery['product.cbdMin'] = sortInfo.order;
            break;
          case ProductSortKey.cbdMax:
            orderQuery['product.cbdMax'] = sortInfo.order;
            break;
          case ProductSortKey.thcMin:
            orderQuery['product.thcMin'] = sortInfo.order;
            break;
          case ProductSortKey.thcMax:
            orderQuery['product.thcMax'] = sortInfo.order;
            break;
          case ProductSortKey.status:
            orderQuery['product.status'] = sortInfo.order;
            break;
          case ProductSortKey.packSize:
            orderQuery['product.packSize'] = sortInfo.order;
            break;
          case ProductSortKey.cannabis:
            orderQuery['product.driedCannabis'] = sortInfo.order;
            break;
          case ProductSortKey.price:
            orderQuery['product.price'] = sortInfo.order;
            break;
          default:
            break;
        }
      });
    } else {
      orderQuery['product.createdAt'] = SortOrder.Desc;
    }
    return await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.brand', 'brand')
      .where(whereClause, { keyword: `%${keyword}%` })
      .andWhere(
        new Brackets((qb) => {
          if (province) {
            qb.where('product.province is null').orWhere(
              `product.province = '${province}'`,
            );
          } else {
            qb.where('product.province is null').orWhere(
              `product.province is not null`,
            );
          }
        }),
      )
      .orderBy(orderQuery)
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  async findProductsByKeyword(keyword: string): Promise<Product[]> {
    const whereClause = `(product.name ilike :keyword or product.medicalPin ilike :keyword or product.sku::text ilike :keyword or brand.name::text ilike :keyword)`;
    return await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.brand', 'brand')
      .where(whereClause, { keyword: `%${keyword}%` })
      .addOrderBy('product.createdAt', 'DESC')
      .limit(3)
      .getMany();
  }

  async findProductById(id: string, findRemoved = false): Promise<Product> {
    const product = await this.productRepository.findOne({
      withDeleted: findRemoved,
      relations: ['brand'],
      where: {
        id,
      },
    });
    if (!product) {
      return null;
    }
    return product;
  }

  async deleteProduct(id: string): Promise<SuccessResponse> {
    await this.productRepository.softDelete({ id });
    return new SuccessResponse(true);
  }

  async creatBrand(name: string): Promise<Brand> {
    const newBrand = new Brand();
    newBrand.name = name;
    const added = await this.brandRepository.save(newBrand);
    return this.findBrandById(added.id);
  }

  async findBrandById(id: string): Promise<Brand> {
    return await this.brandRepository.findOne({ where: { id } });
  }

  async getAllBrands(): Promise<Brand[]> {
    return await this.brandRepository.find({});
  }

  async deleteBrand(id: string): Promise<SuccessResponse> {
    await this.brandRepository.softDelete({ id });
    return new SuccessResponse(true);
  }

  count(): Promise<number> {
    return this.productRepository.count();
  }
}
