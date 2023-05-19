import { ColDef } from "ag-grid-community";
import GenericTable from "../../components/GenericTable";
import { IdType } from "../../types/GenericTable";
import { useCallback } from "react";

interface ProductsTypeDto {
  brand: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
}

interface ProductsType extends IdType, ProductsTypeDto {}

const DEFAULT_INPUT_ROW: ProductsType = {
  id: 0,
  brand: "",
  category: "",
  price: 0,
  discountPercentage: 0,
  rating: 0,
  stock: 0,
};

const ProductsTable = () => {
  const colDefs: ColDef<ProductsType>[] = [
    { field: "brand", minWidth: 160 },
    { field: "category", minWidth: 160 },
    { field: "price", type: "numericColumn" },
    { field: "discountPercentage", type: "numericColumn" },
    { field: "rating", type: "numericColumn" },
    { field: "stock", type: "numericColumn" },
  ];

  const onSolveRequest = useCallback(async (data: any) => {
    return data.products!;
  }, []);

  return (
    <GenericTable<ProductsType>
      defaultInputRow={DEFAULT_INPUT_ROW}
      colDefs={colDefs}
      requestUrl="https://dummyjson.com/products"
      callbackFunc={onSolveRequest}
    />
  );
};

export default ProductsTable;
