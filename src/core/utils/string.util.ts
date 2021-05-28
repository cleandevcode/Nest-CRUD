const randomString = require('crypto-random-string');

export function getFullName(source: any): string {
  if (!source) {
    return '';
  }
  return `${source?.firstName || ''}${source.middleName ? (' ' + source.middleName + ' ') : ' '}${source?.lastName || ''}`;
}

export function generateRandomId(length: number): string {
  return randomString({ length, type: 'numeric' })
}
