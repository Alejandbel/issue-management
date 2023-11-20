'use client';

import { SortOrder } from 'primereact/api';
import { Column, ColumnEvent } from 'primereact/column';
import { DataTable, DataTableStateEvent } from 'primereact/datatable';
import React, { FormEvent, useState } from 'react';

import { ItemDialog } from './ItemDialog';
import { cellEditor } from './editors';
import { parseBasedOnType } from './helpers';
import { Parsable, TableColumn } from './types';
import { NumberToSortDirection, SortDirection, SortDirectionToNumber } from '@/types';

type TableProps<T extends Record<string, Parsable>> = {
  items: T[];
  onStateChange?: (sortField: string, sortDirection?: SortDirection, limit?: number, offset?: number) => void | Promise<void>;
  onUpdate?: (newValue: T) => void | Promise<void>;
  columns: TableColumn<T>[];
  defaultSortField?: string;
  defaultSortOrder?: SortDirection | null;
  totalRecords?: number;
  offset?: number;
  limit?: number;
  limitStep?: number;
} & ({
  onSave: (e: FormEvent<HTMLFormElement>) => void;
  dialogForm: React.ReactNode;
} | {
  onSave?: undefined;
  dialogForm?: undefined;
});

export function Table<T extends Record<string, Parsable>>({
  items,
  onStateChange,
  onUpdate,
  columns,
  defaultSortOrder,
  defaultSortField,
  totalRecords,
  offset = 0,
  limit = 5,
  limitStep = limit,
  dialogForm,
  onSave,
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

  // workaround for pagination
  const paginated = Array.from(new Array(totalRecords), () => undefined) as unknown as Record<string, Parsable>[];

  paginated.splice(offset, limit, ...parsedItems);

  const sortFunction = () => paginated;

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
    await onStateChange?.(event.sortField, event.sortOrder ? NumberToSortDirection[event.sortOrder] : undefined, event.rows, event.first);
    setSortFiled(event.sortField);
    setSortOrder(event.sortOrder ?? undefined);
  };

  return (
    <>
      {onSave ? <ItemDialog onSave={onSave} dialogForm={dialogForm} /> : null}
      <DataTable
        value={paginated}
        sortField={sortFiled?.toString()}
        sortOrder={sortOrder}
        stripedRows
        paginator
        rows={limit}
        rowsPerPageOptions={[limitStep, limitStep * 2, limitStep * 5, limitStep * 10]}
        first={offset}
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
            ...(column.sortable ? {
              sortable: true,
              sortFunction,
            } : {}),
            ...(column.editable ? {
              editor: cellEditor[column.type],
              onCellEditComplete,
            } : {}),
          };

          return <Column key={column.field.toString()} {...props} />;
        })}
      </DataTable>
    </>

  );
}
