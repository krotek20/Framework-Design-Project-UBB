import { useCallback, useMemo, useRef, useState } from "react";
import { Box, Button } from "@mui/material";
import DeselectIcon from "@mui/icons-material/Deselect";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { AgGridReact } from "ag-grid-react";
import {
  CellEditingStartedEvent,
  ColDef,
  ValueFormatterParams,
} from "ag-grid-community";
import {
  DataEditedOptions,
  GenericTableProps,
  IdType,
} from "../types/GenericTable";
import "./GenericTable.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const GenericTable = <TData extends IdType>(
  props: GenericTableProps<TData>
) => {
  const gridRef = useRef<AgGridReact<TData>>(null);
  const {
    defaultInputRow,
    colDefs,
    requestUrl,
    firstColumnCheck,
    saveChanges,
    callbackFunc,
  } = props;
  const [rowData, setRowData] = useState<TData[]>([]);
  const [dataIsEdited, setDataIsEdited] = useState<DataEditedOptions[]>([]);
  const [inputRow, setInputRow] = useState<TData>(
    JSON.parse(JSON.stringify(defaultInputRow))
  );
  const [selectedRowsCount, setSelectedRowsCount] = useState<number>(0);

  const getRowId = useCallback((params: any) => params.data.id, []);

  const onSelectionChanged = () => {
    setSelectedRowsCount(gridRef.current!.api.getSelectedRows().length);
  };

  const onResetSelectedRows = useCallback(() => {
    const gridApi = gridRef.current!.api;
    gridApi.deselectAll();
  }, []);

  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      sortable: true,
      resizable: true,
      filter: true,
      flex: 1,
      minWidth: 100,
      valueFormatter: (params: ValueFormatterParams<TData>): string =>
        params.node!.rowPinned === "top" && !params.value
          ? createPinnedCellPlaceholder(params.colDef!)
          : params.value,
    };
  }, []);

  const createPinnedCellPlaceholder = (colDef: ColDef) =>
    `${colDef.field!.charAt(0).toUpperCase()}${colDef.field!.substring(1)}...`;

  const isPinnedRowCompleted = useCallback(
    (params: CellEditingStartedEvent) => {
      if (params.rowPinned !== "top") return;
      return colDefs.every((def) => inputRow[def.field! as keyof TData]);
    },
    [colDefs, inputRow]
  );

  const rowClassRules = useMemo(() => {
    return {
      rowPinned: (params: any) => params.node.rowPinned === "top",
    };
  }, []);

  const onCellEditingStopped = useCallback(
    (params: CellEditingStartedEvent) => {
      if (isPinnedRowCompleted(params)) {
        // save input row
        setRowData((prevState) => [inputRow, ...prevState]);
        setDataIsEdited((prevState) => [
          { id: inputRow.id, isEdited: true },
          ...prevState,
        ]);

        // reset input row
        const newDefaultInputRow = {
          ...JSON.parse(JSON.stringify(defaultInputRow)),
          id: Math.floor(Math.random() * Date.now()),
        };
        setInputRow(newDefaultInputRow);
      } else {
        setDataIsEdited((prevState) =>
          prevState.map((item) =>
            params.data.id === item.id ? { id: item.id, isEdited: true } : item
          )
        );
      }
    },
    [defaultInputRow, inputRow, isPinnedRowCompleted]
  );

  const onGridReady = useCallback(() => {
    fetch(requestUrl)
      .then((response) => response.json())
      .then(async (data) => {
        const newData: TData[] = [];
        const newDataIsEdited: DataEditedOptions[] = [];
        if (callbackFunc) {
          data = await callbackFunc(data);
        }
        data.forEach((item: TData) => {
          const id = Math.floor(Math.random() * Date.now());
          newData.push({ ...item, id });
          newDataIsEdited.push({ id, isEdited: false });
        });
        setRowData(newData);
        setDataIsEdited(newDataIsEdited);
      });
  }, [requestUrl, callbackFunc]);

  const onDeleteRow = () => {
    const gridApi = gridRef.current!.api;
    const selectedRows = gridApi!.getSelectedRows();
    if (!selectedRows || selectedRows.length === 0) {
      console.log("No rows selected!");
      return;
    }
    gridApi!.applyTransaction({ remove: selectedRows });
    selectedRows.forEach((row) => {
      setRowData((prevState) => prevState.filter((data) => data.id !== row.id));
    });
  };

  const onSaveChanges = () => {
    if (saveChanges) saveChanges(rowData);

    setDataIsEdited((prevState) =>
      prevState.map((state) => ({ ...state, isEdited: false }))
    );
    gridRef.current!.api.redrawRows();
  };

  return (
    <Box className="container">
      <Box className="container-item">
        {gridRef && firstColumnCheck && (
          <span className="count-selected">
            {selectedRowsCount} selected entries.
          </span>
        )}
        <Box className="container-buttons">
          {firstColumnCheck && (
            <Button
              onClick={onResetSelectedRows}
              variant="contained"
              startIcon={<DeselectIcon />}
              disabled={!selectedRowsCount}
            >
              DESELECT ALL
            </Button>
          )}
          {firstColumnCheck && (
            <Button
              onClick={onDeleteRow}
              variant="contained"
              startIcon={<DeleteIcon />}
              color="error"
              disabled={!selectedRowsCount}
            >
              DELETE
            </Button>
          )}
          <Button
            onClick={onSaveChanges}
            variant="contained"
            startIcon={<SaveIcon />}
            color="success"
            disabled={
              !dataIsEdited.reduce((acc, item) => acc || item.isEdited, false)
            }
          >
            SAVE CHANGES
          </Button>
        </Box>
      </Box>
      <div
        className="ag-theme-alpine"
        style={{ height: "50vh", overflow: "hidden" }}
      >
        <AgGridReact
          ref={gridRef}
          domLayout="normal"
          rowData={rowData}
          getRowId={getRowId}
          suppressRowClickSelection={true}
          animateRows={true}
          onSelectionChanged={onSelectionChanged}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          pinnedTopRowData={[inputRow]}
          onCellEditingStopped={onCellEditingStopped}
          rowSelection={"multiple"}
          paginationAutoPageSize={true}
          pagination={true}
          rowClassRules={rowClassRules}
        />
      </div>
    </Box>
  );
};

export default GenericTable;
