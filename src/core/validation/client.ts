import { isNumberString, matches } from 'class-validator';
import { Validator } from 'node-input-validator';
import { ClientDto } from 'src/client/dtos/client.dto';
import { InsurerDto } from 'src/insurer/dtos/insurer.dtos';
import { Insurer } from 'src/insurer/entities/insurer.entity';
import { getRepository } from 'typeorm';
import { getFromDto } from '../utils/repository.util';

export const validateClientDto = async (clientDto: ClientDto) => {
  let validation = true;
  let message = '';

  try {
    if (
      clientDto.prescriptionNumber &&
      !isNumberString(clientDto.prescriptionNumber)
    ) {
      throw new Error('Invalid prescription number');
    }

    if (
      clientDto.prescriptionNumber &&
      !matches(clientDto.prescriptionNumber, /^[0-9]{9}$/)
    ) {
      throw new Error('Invalid prescription number');
    }

    if (clientDto.prescriptionNumber && clientDto.prescriptionNumber)
      if (clientDto.primaryInsuranceInfo) {
        if (
          !clientDto.primaryInsuranceInfo.clientId ||
          clientDto.primaryInsuranceInfo.clientId === ''
        ) {
          throw new Error('Member id required!');
        }

        if (
          clientDto.primaryInsuranceInfo &&
          clientDto.primaryInsuranceInfo.relationship
        ) {
          if (
            !clientDto.primaryInsuranceInfo.adjudicator ||
            clientDto.primaryInsuranceInfo.adjudicator === ''
          ) {
            throw new Error('Adjudicator IIN required!');
          }

          const valideIIN = await validateAdjudicatorIIN(
            clientDto.primaryInsuranceInfo.adjudicator,
          );
          if (!valideIIN) {
            throw new Error('Invalid IIN number!');
          }

          if (
            !clientDto.primaryInsuranceInfo.cardholderIdentity ||
            clientDto.primaryInsuranceInfo.cardholderIdentity === ''
          ) {
            throw new Error('Cardholder identity required!');
          }
        }

        if (
          clientDto.primaryInsuranceInfo &&
          clientDto.primaryInsuranceInfo.carrierId &&
          clientDto.primaryInsuranceInfo.carrierId !== ''
        ) {
          const validCarriderId = await validateCarrierID(
            clientDto.primaryInsuranceInfo.carrierId,
          );
          if (!validCarriderId) {
            throw new Error('Invalid carrier id!');
          }
        }

        if (
          clientDto.primaryInsuranceInfo &&
          !clientDto.primaryInsuranceInfo.insurerId
        ) {
          const newInsurer: InsurerDto = {
            carrierId:
              clientDto.primaryInsuranceInfo.carrierId === ''
                ? null
                : clientDto.primaryInsuranceInfo.carrierId,
            carrierName:
              clientDto.primaryInsuranceInfo.carrierId === ''
                ? null
                : clientDto.primaryInsuranceInfo.carrierId,
            adjudicatorIIN:
              clientDto.primaryInsuranceInfo.adjudicator === ''
                ? null
                : clientDto.primaryInsuranceInfo.adjudicator,
            adjudicatorName:
              clientDto.primaryInsuranceInfo.adjudicator === ''
                ? null
                : clientDto.primaryInsuranceInfo.adjudicator,
          };

          const insurer = getFromDto(newInsurer, new Insurer());
          clientDto.primaryInsuranceInfo.insurerId = await getRepository(
            Insurer,
          )
            .save(insurer)
            .then((item) => item.id)
            .catch((err) => {
              throw new Error('Failed to create new Insurer');
            });
        }
      }

    if (clientDto.secondaryInsuranceInfo) {
      if (
        clientDto.secondaryInsuranceInfo.relationship ||
        clientDto.secondaryInsuranceInfo.adjudicator !== '' ||
        clientDto.secondaryInsuranceInfo.cardholderIdentity !== '' ||
        clientDto.secondaryInsuranceInfo.carrierId !== '' ||
        clientDto.secondaryInsuranceInfo.groupNumber !== '' ||
        clientDto.secondaryInsuranceInfo.clientId !== '' ||
        clientDto.secondaryInsuranceInfo.patientCode !== ''
      ) {
        if (
          !clientDto.secondaryInsuranceInfo.adjudicator ||
          clientDto.secondaryInsuranceInfo.adjudicator === ''
        ) {
          throw new Error('Adjudicator IIN required!');
        }

        if (
          !clientDto.secondaryInsuranceInfo.clientId ||
          clientDto.secondaryInsuranceInfo.clientId === ''
        ) {
          throw new Error('Member id required!');
        }

        if (
          !clientDto.secondaryInsuranceInfo.cardholderIdentity ||
          clientDto.secondaryInsuranceInfo.cardholderIdentity === ''
        ) {
          throw new Error('Cardholder identity required!');
        }

        const valideIIN = await validateAdjudicatorIIN(
          clientDto.secondaryInsuranceInfo.adjudicator,
        );
        if (!valideIIN) {
          throw new Error('Invalid IIN number!');
        }

        if (
          clientDto.secondaryInsuranceInfo &&
          !clientDto.secondaryInsuranceInfo.insurerId &&
          validation
        ) {
          const newInsurer: InsurerDto = {
            carrierId: clientDto.secondaryInsuranceInfo.carrierId,
            carrierName: clientDto.secondaryInsuranceInfo.carrierId,
            adjudicatorIIN: clientDto.secondaryInsuranceInfo.adjudicator,
            adjudicatorName: clientDto.secondaryInsuranceInfo.adjudicator,
          };

          const insurer = getFromDto(newInsurer, new Insurer());
          clientDto.secondaryInsuranceInfo.insurerId = await getRepository(
            Insurer,
          )
            .save(insurer)
            .then((item) => item.id)
            .catch((err) => {
              console.log('Secondary : ', err.message);

              throw new Error('Failed to create new Insurer');
            });
        }
      } else {
        clientDto.secondaryInsuranceInfo = null;
      }
    }
  } catch (error) {
    validation = false;
    message = error.message;
  }

  return {
    validation,
    message,
    data: clientDto,
  };
};

export const validateAdjudicatorIIN = (iin: string) => {
  const validator = new Validator(
    { iin },
    {
      iin: ['required', 'maxLength:6', 'regex:[0-9]{6}'],
    },
  );

  return validator
    .check()
    .then((matched) => {
      if (!matched) throw new Error('Invalid adjudicator IIN number!');
      return iin;
    })
    .catch((err) => {
      return null;
    });
};

export const validateCarrierID = (id: string) => {
  const validator = new Validator(
    { id },
    {
      id: ['required', 'maxLength:2', 'regex:[0-9]{2}'],
    },
  );

  return validator
    .check()
    .then((matched) => {
      if (!matched) throw new Error('Invalid carrier id!');
      return id;
    })
    .catch((err) => {
      return null;
    });
};
