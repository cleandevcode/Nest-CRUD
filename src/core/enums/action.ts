export enum ActionType {
  Create = 'CREATE',
  Update = 'UPDATE',
  Delete = 'DELETE',
}

export enum ActionContentType {
  Role = 'ROLE',
  Login = 'LOGIN',
  Logout = 'LOGOUT',
  User = 'USER',
  Client = 'CLIENT',
  Clinic = 'CLINIC',
  Clinician = 'CLINICIAN',
  Product = 'PRODUCT',
  Insurer = 'INSURER',
  Claim = 'CLAIM',
  Adjudicator = 'ADJUDICATOR',
  College = 'COLLEGE',
  ClaimResponse = 'CLAIMRESPONSE',
  Brand = 'BRAND',
}

export enum ActionSortKey {
  id = 'id',
  time = 'time',
  action = 'action',
  type = 'type',
  ip = 'ip',
  staff = 'staff',
}
