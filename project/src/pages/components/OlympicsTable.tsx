import { ColDef } from "ag-grid-community";
import { IdType } from "../../types/GenericTable";
import GenericTable from "../../components/GenericTable";

interface OlympicsTypeDto {
  age: number;
  athlete: string;
  country: string;
  date: string;
  year: number;
  sport: string;
  bronze: number;
  silver: number;
  gold: number;
  total: number;
}

interface OlympicsType extends IdType, OlympicsTypeDto {}

const DEFAULT_INPUT_ROW: OlympicsType = {
  id: 0,
  age: 0,
  athlete: "",
  country: "",
  date: "",
  year: 0,
  sport: "",
  bronze: 0,
  silver: 0,
  gold: 0,
  total: 0,
};

const OlympicsTable = () => {
  const colDefs: ColDef<OlympicsType>[] = [
    {
      field: "athlete",
      minWidth: 160,
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    { field: "age" },
    { field: "country", minWidth: 140 },
    { field: "year" },
    { field: "date", minWidth: 140 },
    { field: "sport", minWidth: 160 },
    { field: "gold", type: "numericColumn" },
    { field: "silver", type: "numericColumn" },
    { field: "bronze", type: "numericColumn" },
    { field: "total", type: "numericColumn" },
  ];

  return (
    <GenericTable<OlympicsType>
      defaultInputRow={DEFAULT_INPUT_ROW}
      colDefs={colDefs}
      requestUrl="https://www.ag-grid.com/example-assets/olympic-winners.json"
      firstColumnCheck={true}
    />
  );
};

export default OlympicsTable;
