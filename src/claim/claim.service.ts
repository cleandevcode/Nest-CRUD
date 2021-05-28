import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Transaction } from 'typeorm';

import { Claim } from './entities/claim.entity';
import { Cart } from './entities/cart.entity';
import { User } from '../user/entities/user.entity';
import { Client } from '../client/entities/client.entity';
import { Clinician } from '../clinician/entities/clinician.entity';
import { ClaimRequestType } from './entities/requestType.entity';

import { CartDto, ClaimDto, RequestTypeDto } from './dtos/claim.dto';
import { getFromDto, validateSortOption } from '../core/utils/repository.util';
import {
  ClaimSortKey,
  ClaimStatus,
  TransactionSortKey,
} from '../core/enums/claim';
import { SuccessResponse } from '../core/models/success-response';
import { SortOrder } from 'src/core/enums/base';

@Injectable()
export class ClaimService {
  constructor(
    @InjectRepository(Claim)
    private readonly claimRepository: Repository<Claim>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Clinician)
    private readonly clinicianRepository: Repository<Clinician>,
    @InjectRepository(ClaimRequestType)
    private readonly requestTypeRepository: Repository<ClaimRequestType>,
  ) {}

  async createClaim(body: ClaimDto, throwError = true): Promise<Claim> {
    const found = await this.findClaimById(body.id);
    if (found) {
      if (throwError) {
        throw new BadRequestException(`Id is already taken.`);
      } else {
        return found;
      }
    }
    let claim = getFromDto<Claim>(body, new Claim());
    claim = await this.loadClaim(claim, body.carts || []);
    const added = await this.claimRepository.save(claim);
    return this.findClaimById(added.id);
  }

  async updateClaim(claimId: string, data: ClaimDto): Promise<Claim> {
    let claim = await this.findClaimById(claimId);
    if (!claim) {
      throw new BadRequestException('Unable to update non-existing claim.');
    }
    claim = getFromDto<Claim>(data, claim);
    claim.id = claimId;
    claim = await this.loadClaim(claim, data.carts || []);
    const updated = await this.claimRepository.save(claim);
    return this.findClaimById(updated.id);
  }

  async findClaims(
    skip: number,
    take: number,
    keyword = '',
    sortBy: string[] = [],
  ): Promise<[Claim[], number]> {
    const whereClause = `(generalInfo.firstName ilike :keyword or generalInfo.lastName ilike :keyword or generalInfo.middleName ilike :keyword or product.name ilike :keyword or product.sku ilike :keyword or product.medicalPin ilike :keyword or brand.name ilike :keyword )`;
    const orderQuery = {};
    let sortInfo;
    if (sortBy.length > 0) {
      sortBy.map((item) => {
        sortInfo = validateSortOption(ClaimSortKey, item);
        switch (sortInfo.key) {
          case ClaimSortKey.Id:
            orderQuery['claim.id'] = sortInfo.order;
            break;
          case ClaimSortKey.name:
            orderQuery['generalInfo.firstName'] = sortInfo.order;
            break;
          case ClaimSortKey.CreateAt:
            orderQuery['claim.createdAt'] = sortInfo.order;
            break;
          case ClaimSortKey.Covered:
            orderQuery['claim.covered'] = sortInfo.order;
            break;
          case ClaimSortKey.Subtotal:
            orderQuery['claim.subTotal'] = sortInfo.order;
            break;
          case ClaimSortKey.Total:
            orderQuery['claim.total'] = sortInfo.order;
            break;
          case ClaimSortKey.Quantity:
            orderQuery['carts.quantity'] = sortInfo.order;
            break;
          default:
            break;
        }
      });
    } else {
      orderQuery['claim.createdAt'] = SortOrder.Desc;
    }

    return await this.claimRepository
      .createQueryBuilder('claim')
      .leftJoinAndSelect('claim.user', 'user')
      .leftJoinAndSelect('claim.client', 'client')
      .leftJoinAndSelect('client.generalInfo', 'generalInfo')
      .leftJoinAndSelect('client.primaryInsuranceInfo', 'primaryInsuranceInfo')
      .leftJoinAndSelect(
        'client.secondaryInsuranceInfo',
        'secondaryInsuranceInfo',
      )
      .leftJoinAndSelect('claim.clinician', 'clinician')
      .leftJoinAndSelect('claim.carts', 'carts')
      .leftJoinAndSelect('carts.product', 'product')
      .leftJoinAndSelect('product.brand', 'brand')
      .where('"subTotal" is not null')
      .andWhere(whereClause, { keyword: `%${keyword}%` })
      .orderBy(orderQuery)
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  async findClaimById(id: string): Promise<Claim> {
    const claim = await this.claimRepository.findOne({
      relations: [
        'user',
        'client',
        'client.generalInfo',
        'client.primaryInsuranceInfo',
        'client.secondaryInsuranceInfo',
        'clinician',
        'carts',
        'carts.product',
        'carts.product.brand',
      ],
      where: {
        id,
      },
    });
    if (!claim) {
      return null;
    }
    return claim;
  }

  async addCarts(cartDtos: CartDto[]): Promise<Cart[]> {
    return this.cartRepository.save(
      cartDtos.map((cart) => getFromDto<Cart>(cart, new Cart())),
    );
  }

  async loadClaim(claim: Claim, carts: CartDto[]): Promise<Claim> {
    if (carts && carts.length) {
      const cartItems = await this.addCarts(carts);
      claim.carts = [...cartItems];
    } else {
      claim.carts = [];
      claim.carts = null;
    }
    return claim;
  }

  async findTransactions(
    skip: number,
    take: number,
    keyword = '',
    provider: string,
    insurer: string,
    startDate: Date,
    endDate: Date,
    status: ClaimStatus,
    requestType: string,
    lastName = '',
    sortBy: string[] = [],
  ): Promise<[Claim[], number]> {
    let whereClause = `(generalInfo.firstName ilike :keyword or generalInfo.lastName ilike :keyword or generalInfo.middleName ilike :keyword or product.name ilike :keyword or product.sku ilike :keyword or product.medicalPin ilike :keyword or brand.name ilike :keyword)`;

    if (lastName) {
      whereClause = `generalInfo.lastName ilike '%${lastName}%'`;
    }

    if (provider) {
      whereClause += ` and primaryInsuranceInfo.adjudicator = '${provider}'`;
    }

    if (insurer) {
      whereClause += ` and primaryInsuranceInfo.carrierId = '${insurer}'`;
    }

    if (status) {
      whereClause += ` and claim.status = '${status}'`;
    }

    if (requestType) {
      whereClause += ` and claim.requestType.id = '${requestType}'`;
    }

    const orderQuery = {};
    let sortInfo;

    if (sortBy.length > 0) {
      sortBy.map((item) => {
        sortInfo = validateSortOption(TransactionSortKey, item);
        switch (sortInfo.key) {
          case ClaimSortKey.Id:
            orderQuery['claim.id'] = sortInfo.order;
            break;
          case ClaimSortKey.name:
            orderQuery['generalInfo.firstName'] = sortInfo.order;
            break;
          case ClaimSortKey.CreateAt:
            orderQuery['claim.createdAt'] = sortInfo.order;
            break;
          case ClaimSortKey.Covered:
            orderQuery['claim.covered'] = sortInfo.order;
            break;
          case ClaimSortKey.Subtotal:
            orderQuery['claim.subTotal'] = sortInfo.order;
            break;
          case ClaimSortKey.Total:
            orderQuery['claim.total'] = sortInfo.order;
            break;
          case ClaimSortKey.Quantity:
            orderQuery['carts.quantity'] = sortInfo.order;
            break;
          default:
            break;
        }
      });
    } else {
      orderQuery['claim.createdAt'] = SortOrder.Desc;
    }

    const [data, count] = await this.claimRepository
      .createQueryBuilder('claim')
      .leftJoinAndSelect('claim.user', 'user')
      .leftJoinAndSelect('claim.client', 'client')
      .leftJoinAndSelect('client.generalInfo', 'generalInfo')
      .leftJoinAndSelect('client.primaryInsuranceInfo', 'primaryInsuranceInfo')
      .leftJoinAndSelect(
        'client.secondaryInsuranceInfo',
        'secondaryInsuranceInfo',
      )
      .leftJoinAndSelect('claim.clinician', 'clinician')
      .leftJoinAndSelect('claim.carts', 'carts')
      .leftJoinAndSelect('claim.requestType', 'requestType')
      .leftJoinAndSelect('carts.product', 'product')
      .leftJoinAndSelect('product.brand', 'brand')
      .andWhere(whereClause, { keyword: `%${keyword}%` })
      .andWhere(
        `claim.updatedAt between '${startDate.toISOString()}' and '${endDate.toISOString()}'`,
      )
      .orderBy(orderQuery)
      .skip(skip)
      .take(take)
      .getManyAndCount();

    return [data, count];
  }

  async findRequestTypeById(id: string): Promise<ClaimRequestType> {
    const requestType = await this.requestTypeRepository.findOne({
      where: { id },
    });

    if (!requestType) return null;

    return requestType;
  }

  async createRequestType(
    body: RequestTypeDto,
    throwError = true,
  ): Promise<ClaimRequestType> {
    const found = await this.findRequestTypeById(body.id);
    if (found) {
      if (throwError) {
        throw new BadRequestException(`Type id is already taken.`);
      } else {
        return found;
      }
    }

    const requestType = getFromDto<ClaimRequestType>(
      body,
      new ClaimRequestType(),
    );
    const added = await this.requestTypeRepository.save(requestType);
    return this.findRequestTypeById(added.id);
  }

  async getAllRequestTypes(): Promise<Array<ClaimRequestType>> {
    return this.requestTypeRepository.find();
  }

  async deleteClaim(id: string): Promise<SuccessResponse> {
    await this.claimRepository.softDelete({ id });
    return new SuccessResponse(true);
  }
}
