export enum ClaimStatus {
  Covered = 'COVERED',
  PartiallyCovered = 'PARTIALLY_COVERED',
  NotCovered = 'NOT_COVERED',
  Reversed = 'REVERSED',
}

export enum ClaimStatusShortKey {
  Covered = '',
  PartiallyCovered = '',
  NotCovered = 'R',
  Reversed = 'V',
}

export enum ClaimSortKey {
  Id = 'id',
  Quantity = 'qty',
  Subtotal = 'subtotalPrice',
  Covered = 'coveredPrice',
  Total = 'totalPrice',
  name = 'name',
  CreateAt = 'createdAt',
}

export enum TransactionSortKey {
  Id = 'id',
  Quantity = 'qty',
  Subtotal = 'subtotalPrice',
  Covered = 'coveredPrice',
  Total = 'totalPrice',
  CreateAt = 'createdAt',
  provider = 'provider',
  status = 'status',
  processedBy = 'processedBy',
  name = 'name',
}