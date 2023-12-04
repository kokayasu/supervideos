import Grid from "@mui/material/Unstable_Grid2";
import Container from '@mui/material/Container';
import { ReactNode } from "react";

import Footer from "@src/Footer";
import Header from "@src/Header";

export default function PageContainer({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <Container maxWidth="xl" sx={{ p: 0, mt: 2 }}>
        <Grid container spacing={2} columns={16} sx={{ mx: 1 }}>
          {children}
        </Grid>
      </Container>
      <Footer />
    </>
  );
}
