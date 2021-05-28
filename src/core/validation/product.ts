import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { isEnum, isNumber } from 'class-validator';
import { ProductDto } from 'src/product/dtos/product.dtos';
import { Brand } from 'src/product/entities/brand.entity';
import { Product } from 'src/product/entities/product.entity';
import { getRepository, IsNull, Not } from 'typeorm';
import {
  PotencyRank,
  ProductCategory,
  ProductClass,
  ProductPackSizeUOM,
  ProductStatus,
  ProductStatusReason,
  ProductSubClass,
  ProductType,
  vacCoverage,
} from '../enums/product';

export const validateProduct = async (product: ProductDto) => {
  if (!product.brandId || product.brandId === '') {
    throw new BadRequestException('Brand id required!');
  }

  if (!product.category) {
    throw new BadRequestException('Product category required!');
  }

  if (!isEnum(product.category, ProductCategory)) {
    throw new BadRequestException('Invalid product category!');
  }

  if (!product.class) {
    throw new BadRequestException('Product class required!');
  }

  if (!isEnum(product.class, ProductClass)) {
    throw new BadRequestException('Invalid class!');
  }

  if (!product.subClass) {
    throw new BadRequestException('Product sub-class required!');
  }

  if (!isEnum(product.subClass, ProductSubClass)) {
    throw new BadRequestException('Invalid sub-class!');
  }

  if (!product.name || product.name === '') {
    throw new BadRequestException('Product name required!');
  }

  if (!product.sku || product.sku === '') {
    throw new BadRequestException('SKU required!');
  }

  if (product.province === '') product.province = null;

  product.sku = product.sku.trim();
  product.name = product.name.trim();

  const duplicates = await getRepository(Product).find({
    where: {
      sku: product.sku,
      name: product.name,
      province: product.province,
      id: product.id ? Not(product.id) : Not(IsNull()),
    },
  });

  if (duplicates.length > 0)
    throw new BadRequestException('Duplicate product!');

  if (!product.type) {
    throw new BadRequestException('Product type required!');
  }

  if (!isEnum(product.type, ProductType)) {
    throw new BadRequestException('Invalid product type!');
  }

  if (!product.medicalPin || product.medicalPin === '') {
    throw new BadRequestException('Medical Pin required!');
  }

  if (!product.vacCoverage) {
    throw new BadRequestException('VAC coverage required!');
  }

  if (!isEnum(product.vacCoverage, vacCoverage)) {
    throw new BadRequestException('Invalid VAC coverage!');
  }

  if (!product.status) {
    throw new BadRequestException('Product status required!');
  }

  if (!isEnum(product.status, ProductStatus)) {
    throw new BadRequestException('Invalid product status!');
  }

  if (!product.statusReason) {
    throw new BadRequestException('Product status reason required!');
  }

  if (!isEnum(product.statusReason, ProductStatusReason)) {
    throw new BadRequestException('Invalid product status reason!');
  }

  if (!product.medicalListPrice) {
    throw new BadRequestException('Medical list price required!');
  }

  if (!isNumber(product.medicalListPrice) || product.medicalListPrice <= 0) {
    throw new BadRequestException('Invalid medical list price!');
  }

  if (!product.packSize) {
    throw new BadRequestException('Pack size required!');
  }

  if (!isNumber(product.packSize) || product.packSize < 0) {
    throw new BadRequestException('Invalid pack size!');
  }

  if (!product.packSizeUOM) {
    throw new BadRequestException('Pack Size UOM required!');
  }

  if (!isEnum(product.packSizeUOM, ProductPackSizeUOM)) {
    throw new BadRequestException('Invalid pack size UOM!');
  }

  if (product.cbdMin && !isNumber(product.cbdMin)) {
    throw new BadRequestException('Invalid CBD Min value!');
  }

  if (product.cbdMax && !isNumber(product.cbdMax)) {
    throw new BadRequestException('Invalid CBD max value!');
  }

  if (product.thcMin && !isNumber(product.thcMin)) {
    throw new BadRequestException('Invalid THC min value!');
  }

  if (product.thcMax && !isNumber(product.thcMax)) {
    throw new BadRequestException('Invalid THC max value!');
  }

  if (!product.driedCannabis) {
    throw new BadRequestException('Dried cannabis equivalency required!');
  }

  if (!isNumber(product.driedCannabis) || product.driedCannabis < 0) {
    throw new BadRequestException('Invalid dried cannabis equivalency!');
  }

  if (product.thcRank && !isEnum(product.thcRank, PotencyRank)) {
    throw new BadRequestException('Invalid THC potency rank!');
  }

  if (product.cbdRank && !isEnum(product.cbdRank, PotencyRank)) {
    throw new BadRequestException('Invalid CBD potency rank!');
  }

  if (product.brandId) {
    const brand = await getRepository(Brand).findOne({
      where: { id: product.brandId },
    });

    if (!brand) {
      const newBrand = new Brand();
      newBrand.name = product.brandId;
      const added = await getRepository(Brand)
        .save(newBrand)
        .then((brand) => brand)
        .catch((err) => {
          throw new InternalServerErrorException('Failed to add new brand!');
        });
      product.brandId = added.id;
    }
  }

  return product;
};
