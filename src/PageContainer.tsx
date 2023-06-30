import Grid from "@mui/material/Unstable_Grid2";
import { ReactNode } from "react";

import Footer from "@src/Footer";
import Header from "@src/Header";

export default function PageContainer({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <Grid container spacing={2} columns={16} sx={{ m: 2, mt: 8 }}>
        {children}
      </Grid>
      <Footer />
    </>
  );
}
