import { ColDef } from "ag-grid-community";
import GenericTable from "../../components/GenericTable";
import { IdType } from "../../types/GenericTable";

interface RestCountriesTypeDto {
  flag: string;
  region: string;
  subregion: string;
  population: number;
}

interface RestCountriesType extends IdType, RestCountriesTypeDto {}

const DEFAULT_INPUT_ROW: RestCountriesType = {
  id: 0,
  flag: "",
  region: "",
  subregion: "",
  population: 0,
};

const RestCountriesTable = () => {
  const colDefs: ColDef<RestCountriesType>[] = [
    { headerName: "Country Code", field: "flag" },
    { field: "region" },
    { field: "subregion" },
    { field: "population", type: "numericColumn" },
  ];

  return (
    <GenericTable<RestCountriesType>
      defaultInputRow={DEFAULT_INPUT_ROW}
      colDefs={colDefs}
      requestUrl="https://restcountries.com/v3.1/all"
    />
  );
};

export default RestCountriesTable;
