import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClaimResponseDto } from './dtos/claim-response.dto';
import { ClaimResponseOrder } from './entities/claim-response-order.entity';
import { getFromDto } from '../core/utils/repository.util';
import { ClaimResponseRequest } from './entities/claim-response-request.entity';
import { ClaimResponse } from './entities/claimResponse.entity';
import { ClaimResponseResponse } from './entities/claim-response-response.entity';
import { SuccessResponse } from 'src/core/models/success-response';

@Injectable()
export class ClaimResponseService {
  constructor(
    @InjectRepository(ClaimResponse)
    private readonly claimResponseRepository: Repository<ClaimResponse>,
    @InjectRepository(ClaimResponseOrder)
    private readonly claimResponseOrderRepository: Repository<ClaimResponseOrder>,
    @InjectRepository(ClaimResponseRequest)
    private readonly claimResponseRequestRepository: Repository<ClaimResponseRequest>,
    @InjectRepository(ClaimResponseResponse)
    private readonly claimResponseResponseRepository: Repository<ClaimResponseResponse>,
  ) {}

  async createClaimResponse(body: ClaimResponseDto) {
    const claimResponse = getFromDto<ClaimResponse>(body, new ClaimResponse());
    const newClaimRes = await this.claimResponseRepository.save(claimResponse);
    claimResponse.order = await Promise.all(
      body.order.map(async (item) => {
        const claimResponseRequest = getFromDto<ClaimResponseRequest>(
          { ...item.request, pharmacyID: process.env.PHARMACYID },
          new ClaimResponseRequest(),
        );
        const claimResponseResponse = getFromDto<ClaimResponseResponse>(
          item.response,
          new ClaimResponseResponse(),
        );

        const newReq = await this.claimResponseRequestRepository.save(
          claimResponseRequest,
        );
        const newRes = await this.claimResponseResponseRepository.save(
          claimResponseResponse,
        );
        const claimResonseOrder = getFromDto<ClaimResponseOrder>(
          {
            ...item,
            requestId: newReq.id,
            responseId: newRes.id,
            claimResponse: newClaimRes.id,
          },
          new ClaimResponseOrder(),
        );

        return this.claimResponseOrderRepository.save(claimResonseOrder);
      }),
    );
    const added = await this.claimResponseRepository.save(claimResponse);

    return this.findClaimResponseById(added.id);
  }

  async findClaimResponseById(id: string): Promise<ClaimResponse> {
    return this.claimResponseRepository.findOne({ where: { id } });
  }

  async findClaimResponses(
    skip: number,
    take: number,
    keyword = '',
  ): Promise<[ClaimResponse[], number]> {
    return this.claimResponseRepository
      .createQueryBuilder('claimResponse')
      .addOrderBy('claimResponse.createdAt', 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  async getAll(): Promise<ClaimResponse[]> {
    return this.claimResponseRepository.find({});
  }

  async deleteClaimResponse(id: string): Promise<SuccessResponse> {
    await this.claimResponseRepository.softDelete({ id });
    return new SuccessResponse(true);
  }

  async findClaimResponseByOrderId(orderId: string): Promise<ClaimResponse> {
    return await this.claimResponseRepository.findOne({
      where: { orderId },
    });
  }

  async removeClaimResponse(orderId: string): Promise<SuccessResponse> {
    await this.claimResponseRepository
      .createQueryBuilder('claimResponse')
      .delete()
      .where('orderId = :orderId', { orderId: orderId })
      .execute();

    return new SuccessResponse(true);
  }
}
