import { UserRole } from '../enums/user';

export const jwtConstant = {
  secret: process.env.GOJIRX_JWT_SECRET_KEY || 'GncXDDmKEeyM85FLa4HdXE9FVaehsqVaDu67YQpnwUxeSzL2DkbzbCgP2qKX2nrG',
  expiresIn: '3h',
};

export const adminUser = {
  email: 'aurora_test_root_1@outlook.com',
  firstName: 'Root',
  lastName: 'Test1',
  role: UserRole.Admin
}

export const conditions = [
  'Chronic Pain',
  'Anxiety',
  'Post Traumatic Stress Disorder',
  'Back & Neck Problems',
  'Insomnia',
  'Arthritis',
  'Depression',
  'Migraines',
  'Cancer Related Pain',
  'ADD / ADHD'
];

export const defaultTakeCount = 5;
