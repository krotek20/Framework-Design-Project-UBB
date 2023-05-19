import { ColDef } from "ag-grid-community";

export interface IdType {
  id: number;
}

export interface DataEditedOptions {
  id: number;
  isEdited: boolean;
}

export interface GenericTableProps<TData> {
  defaultInputRow: TData;
  colDefs: ColDef[];
  requestUrl: string;
  firstColumnCheck?: boolean;
  saveChanges?: (data: TData[]) => void;
  callbackFunc?: <TData>(data: any[]) => Promise<TData[]>;
}
