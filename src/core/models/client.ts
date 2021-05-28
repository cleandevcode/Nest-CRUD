export interface InsuranceInterface {
  id: string;
  carrierId: string;
  adjudicator: string;
  groupNumber: string;
  clientId: string;
  patientCode: string;
  cardholderIdentity: string;
  relationship: string;
  reason: string;
}

export interface InsuranceInputInterface {
  primaryInsuranceInfo?: InsuranceInterface;
  secondaryInsuranceInfo?: InsuranceInterface;
  reason?: string;
}
