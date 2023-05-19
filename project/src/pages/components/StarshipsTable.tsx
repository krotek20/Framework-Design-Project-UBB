import { ColDef } from "ag-grid-community";
import GenericTable from "../../components/GenericTable";
import { IdType } from "../../types/GenericTable";
import { useCallback } from "react";

interface StarshipsTypeDto {
  name: string;
  model: string;
  manufacturer: string;
  crew: string;
  passengers: string;
  consumables: string;
}

interface StarshipsType extends IdType, StarshipsTypeDto {}

const DEFAULT_INPUT_ROW: StarshipsType = {
  id: 0,
  name: "",
  model: "",
  manufacturer: "",
  crew: "",
  passengers: "",
  consumables: "",
};

const StarshipsTable = () => {
  const colDefs: ColDef<StarshipsType>[] = [
    {
      field: "name",
      minWidth: 160,
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    { field: "model", minWidth: 160 },
    { field: "manufacturer", minWidth: 160 },
    { field: "crew", minWidth: 160 },
    { field: "passengers", minWidth: 160 },
    { field: "consumables", minWidth: 160 },
  ];

  const onSolveRequest = useCallback(async (data: any) => {
    return data.results!;
  }, []);

  return (
    <GenericTable<StarshipsType>
      defaultInputRow={DEFAULT_INPUT_ROW}
      colDefs={colDefs}
      requestUrl="https://swapi.dev/api/starships/"
      callbackFunc={onSolveRequest}
      firstColumnCheck={true}
    />
  );
};

export default StarshipsTable;
