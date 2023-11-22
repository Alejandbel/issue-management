'use client';

import { SortOrder } from 'primereact/api';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, DataTableStateEvent } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { Toolbar } from 'primereact/toolbar';
import React, { FormEvent, useRef, useState } from 'react';

import { parseBasedOnType } from './helpers';
import { Parsable, TableColumn } from './types';
import { NumberToSortDirection, SortDirection, SortDirectionToNumber } from '@/types';

type TableProps<T extends Record<string, Parsable>> = {
  items: T[];
  onStateChange?: (sortField: string, sortDirection?: SortDirection, limit?: number, offset?: number) => void | Promise<void>;
  columns: TableColumn<T>[];
  defaultSortField?: string;
  defaultSortOrder?: SortDirection | null;
  totalRecords?: number;
  offset?: number;
  limit?: number;
  limitStep?: number;
} & ({
  onSave: (e: FormEvent<HTMLFormElement>) => void | Promise<void>;
  dialogForm: (defaultItem?: T) => React.ReactNode;
  actions: ('delete' | 'update' | 'create')[]
} | {
  onSave?: undefined;
  dialogForm?: undefined;
  actions?: undefined;
});

export function Table<T extends Record<string, Parsable>>({
  items,
  onStateChange,
  columns,
  defaultSortOrder,
  defaultSortField,
  totalRecords,
  offset = 0,
  limit = 5,
  limitStep = limit,
  dialogForm,
  onSave,
  actions,
}: TableProps<T>) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder | undefined>(
    defaultSortField ? SortDirectionToNumber[defaultSortOrder!] : undefined,
  );
  const [sortFiled, setSortFiled] = useState(defaultSortField);
  const [defaultItem, setDefaultItem] = useState<T | undefined>();

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

  const hideDialog = () => {
    setIsVisible(false);
  };

  const openDialog = () => {
    setIsVisible(true);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    await onSave?.(e);
    hideDialog();
  };

  const submitForm = () => {
    formRef.current?.requestSubmit();
  };

  const createProduct = () => {
    setDefaultItem(undefined);
    openDialog();
  };

  const editProduct = (rowData: T) => {
    setDefaultItem(rowData);
    openDialog();
  };

  const stateChangeFunction = async (event: DataTableStateEvent) => {
    await onStateChange?.(event.sortField, event.sortOrder ? NumberToSortDirection[event.sortOrder] : undefined, event.rows, event.first);
    setSortFiled(event.sortField);
    setSortOrder(event.sortOrder ?? undefined);
  };

  const actionBodyTemplate = (rowData: T) => (
    <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProduct(rowData)} />
  );

  return (
    <>
      {onSave && actions?.includes('create') ? (
        <Toolbar start={(
          <div className="flex flex-wrap gap-2">
            <Button label="New" icon="pi pi-plus" severity="success" onClick={createProduct} />
          </div>
        )}
        />
      ) : null}
      {onSave && (
      <Dialog
        visible={isVisible}
        onHide={hideDialog}
        footer={(
          <>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={submitForm} />
          </>
        )}
      >
        <form ref={formRef} onSubmit={onSubmit}>
          {dialogForm(defaultItem)}
        </form>
      </Dialog>
      )}
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
              sortFunction: () => paginated,
            } : {}),
          };

          return <Column key={column.field.toString()} {...props} />;
        })}
        {actions?.includes('update') ? <Column body={actionBodyTemplate} /> : null}
      </DataTable>
    </>
  );
}
