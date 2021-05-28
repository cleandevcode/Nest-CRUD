import { BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SortOptionDto } from '../dtos/pagination.dto';
import { SortOrder } from '../enums/base';

export function getFromDto<T>(dto: any, data: any, fields?: string[]): T {
  let properties: string[] = [];
  if (fields && fields.length) {
    properties = fields;
  } else {
    properties = Object.keys(dto);
  }
  properties.forEach((property) => {
    data[property] = dto[property];
  });
  return data;
}

export function saveDtoToRepository<T>(
  dto: any,
  data: any,
  repository: Repository<T>,
  fields?: string[],
): Promise<T> {
  const obj = getFromDto<T>(dto, data, fields);
  return repository.save(obj);
}

export function validateSortOption<T>(
  ename: any,
  data: string,
): Promise<SortOptionDto> {
  const keys = Object.values(ename).map((item) => String(item));
  const values = Object.values(SortOrder).map((item) => String(item));
  const sortOpt = data.split(':');

  if (sortOpt.length < 2) throw new BadRequestException('Invalid Sort option');

  const key = sortOpt[0];
  const order = sortOpt[1];

  if (!keys.includes(key))
    throw new BadRequestException(`Invalid sort key - ${key}`);
  if (!values.includes(order))
    throw new BadRequestException(`Invalid order type - ${order}`);

  return Object.assign({ key, order });
}
