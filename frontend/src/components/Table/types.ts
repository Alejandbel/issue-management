export type ColumnType = 'date' | 'string' | 'numeric';
export type Parsable = number | Date | string | null | undefined;
export type TableColumn<T> = { field: keyof T, header: string, type: ColumnType, sortable?: boolean; };
