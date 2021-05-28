import { BadRequestException } from '@nestjs/common';
import { isEnum, isNumberString } from 'class-validator';
import { ClaimDto } from 'src/claim/dtos/claim.dto';
import { ClaimStatus } from '../enums/claim';

export const validateClaim = async (claim: ClaimDto): Promise<ClaimDto> => {
  if (!claim.clinician || claim.clinician === '')
    throw new BadRequestException('Clinician id required!');
  if (!claim.clinicId || claim.clinicId === '') claim.clinicId = null;

  if (!isEnum(claim.status, ClaimStatus))
    throw new BadRequestException('Invalid claim status!');
  if (!isNumberString(claim.clinician) || claim.clinician.length !== 15)
    throw new BadRequestException('Invalid clinician id!');
  if (!isNumberString(claim.client) || claim.client.length !== 15)
    throw new BadRequestException('Invalid client id!');
  if (!isNumberString(claim.user) || claim.user.length !== 15)
    throw new BadRequestException('Invalid user id!');
  return claim;
};
