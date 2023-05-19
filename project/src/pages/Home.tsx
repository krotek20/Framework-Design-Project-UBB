import { Box, Grid, Typography } from "@mui/material";
import OlympicsTable from "./components/OlympicsTable";
import ProductsTable from "./components/ProductsTable";
import RestCountriesTable from "./components/RestCountriesTable";
import StarshipsTable from "./components/StarshipsTable";

const Home = () => {
  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h3" align="center" fontFamily={"monospace"}>
        Sample Tables
      </Typography>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
          <RestCountriesTable />
        </Grid>
        <Grid item xs={6}>
          <ProductsTable />
        </Grid>
        <Grid item xs={6}>
          <StarshipsTable />
        </Grid>
        <Grid item xs={6}>
          <OlympicsTable />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
