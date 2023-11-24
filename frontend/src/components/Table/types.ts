import React from 'react';

export type ColumnType = 'date' | 'string' | 'numeric';
export type Parsable = number | Date | string | null | undefined;
export type TableColumn<T extends Record<string, unknown>, TField extends keyof T = keyof T> =
  {
    field: TField,
    header: string,
    sortable?: boolean,

  } & ({
    type: ColumnType,
    template?: never,
  } | {
    template: (val: T[TField]) => React.ReactNode,
    type?: never,
  });
