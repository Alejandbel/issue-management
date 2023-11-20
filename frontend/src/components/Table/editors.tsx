import { Calendar } from 'primereact/calendar';
import { ColumnEditorOptions } from 'primereact/column';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import React, { JSX } from 'react';

import { ColumnType } from './types';

export const dateEditor = (options: ColumnEditorOptions) => (
  <Calendar
    value={options.value}
    onSelect={(e) => options.editorCallback?.(e.value)}
  />
);
export const textEditor = (options: ColumnEditorOptions) => (
  <InputText
    type="text"
    value={options.value}
    onChange={(e) => options.editorCallback?.(e.target.value)}
  />
);

export const numericEditor = (options: ColumnEditorOptions) => (
  <InputNumber
    value={options.value}
    onValueChange={(e) => options.editorCallback?.(e.value)}
  />
);

export const cellEditor: Record<ColumnType, (options: ColumnEditorOptions) => JSX.Element> = {
  string: textEditor,
  date: dateEditor,
  numeric: numericEditor,
};
