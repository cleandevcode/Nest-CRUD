import { BadRequestException } from '@nestjs/common';
import { isPhoneNumber } from 'class-validator';
import { ClinicianDto } from 'src/clinician/dtos/clinician.dtos';

export const validateClinician = (clinician: ClinicianDto) => {
  if (!clinician.phone || clinician.phone === '')
    throw new BadRequestException('Phone number required!');
  if (isPhoneNumber(clinician.phone))
    throw new BadRequestException('Invalid phone number!');
  return clinician;
};
