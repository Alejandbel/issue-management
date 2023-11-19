'use client';

import { SortOrder } from 'primereact/api';
import { Calendar } from 'primereact/calendar';
import { Column, ColumnEditorOptions, ColumnEvent } from 'primereact/column';
import { DataTable, DataTableStateEvent } from 'primereact/datatable';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import React, { JSX, useState } from 'react';

import { NumberToSortDirection, SortDirection, SortDirectionToNumber } from '@/types';

type ColumnType = 'date' | 'string' | 'numeric';
type Parsable = number | Date | string | null | undefined;

export type TableColumn<T> = { field: keyof T, header: string, type: ColumnType, sortable?: boolean; editable?: boolean; };

type TableProps<T extends Record<string, Parsable>> = {
  items: T[];
  onSort?: (sortField: string, sortDirection?: SortDirection) => void | Promise<void>;
  onUpdate?: (newValue: T) => void | Promise<void>;
  columns: TableColumn<T>[];
  defaultSortField?: string;
  currentPage?: number;
  defaultSortOrder?: SortDirection | null;
  totalRecords?: number;
  first?: number;
};

function parseBasedOnType(value: Parsable, type: ColumnType) {
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

const dateEditor = (options: ColumnEditorOptions) => (
  <Calendar
    value={options.value}
    onSelect={(e) => options.editorCallback?.(e.value)}
  />
);
const textEditor = (options: ColumnEditorOptions) => (
  <InputText
    type="text"
    value={options.value}
    onChange={(e) => options.editorCallback?.(e.target.value)}
  />
);

const numericEditor = (options: ColumnEditorOptions) => (
  <InputNumber
    value={options.value}
    onValueChange={(e) => options.editorCallback?.(e.value)}
  />
);

const cellEditor: Record<ColumnType, (options: ColumnEditorOptions) => JSX.Element> = {
  string: textEditor,
  date: dateEditor,
  numeric: numericEditor,
};

export default function Table<T extends Record<string, Parsable>>({
  items,
  onSort,
  onUpdate,
  columns,
  defaultSortOrder,
  defaultSortField,
  totalRecords,
  first,
}: TableProps<T>) {
  const [sortOrder, setSortOrder] = useState<SortOrder | undefined>(
    defaultSortField ? SortDirectionToNumber[defaultSortOrder!] : undefined,
  );
  const [sortFiled, setSortFiled] = useState(defaultSortField);

  const fieldToColumnMap = new Map(columns.map((column) => [column.field, column]));

  const parsedItems = items.map((item) => {
    const parsedItem: Record<string, string | null | undefined | number> = {};

    for (const [key, { type }] of fieldToColumnMap.entries()) {
      parsedItem[key as string] = parseBasedOnType(item[key], type);
    }

    return parsedItem;
  });

  const onCellEditComplete = (e: ColumnEvent) => {
    const {
      rowData,
      newValue,
      field,
    } = e;

    const column = fieldToColumnMap.get(field);

    if (!column) {
      return;
    }

    rowData[field] = parseBasedOnType(newValue, column.type);
    onUpdate?.(rowData);
  };

  const stateChangeFunction = async (event: DataTableStateEvent) => {
    await onSort?.(event.sortField, event.sortOrder ? NumberToSortDirection[event.sortOrder] : undefined);
    setSortFiled(event.sortField);
    setSortOrder(event.sortOrder ?? undefined);
  };

  return (
    <DataTable
      dataKey="id"
      value={parsedItems}
      sortField={sortFiled?.toString()}
      sortOrder={sortOrder}
      stripedRows
      paginator
      rows={5}
      rowsPerPageOptions={[5, 10, 25, 50]}
      pageLinkSize={5}
      totalRecords={totalRecords}
      first={first}
      onPage={stateChangeFunction}
      onSort={stateChangeFunction}
      editMode="cell"
      size="large"
      className="m-2"
      tableStyle={{ minWidth: '50rem' }}
    >
      {columns.map((column) => {
        const props: Record<string, unknown> = {
          field: column.field.toString(),
          header: column.header,
          ...(column.sortable ? { sortable: true } : {}),
          ...(column.editable ? {
            editor: cellEditor[column.type],
            onCellEditComplete,
          } : {}),
        };

        return <Column key={column.field.toString()} {...props} />;
      })}
    </DataTable>
  );
}
