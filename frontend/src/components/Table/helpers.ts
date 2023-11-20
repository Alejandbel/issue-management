import { ColumnType, Parsable } from './types';

export function parseBasedOnType(value: Parsable, type: ColumnType) {
  if (value === null || value === undefined) {
    return value;
  }

  switch (type) {
    case 'string':
      return String(value);
    case 'date':
      return new Date(value).toLocaleDateString();
    case 'numeric':
      return value as number;
    default:
      throw new Error('Unknown type');
  }
}
