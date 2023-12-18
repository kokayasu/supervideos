import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import { useRouter } from "next/router";
import { ReactNode } from "react";

import Footer from "@src/Footer";
import Header from "@src/Header";
import {
  getThickHorizontalBanner,
  getThinHorizontalBanner,
} from "@src/adUtils";

export default function PageContainer({
  children,
  includeTopAd = true,
  includeBottomAd = true,
}: {
  children: ReactNode;
  includeTopAd?: boolean;
  includeBottomAd?: boolean;
}) {
  const router = useRouter();
  const locale = router.locale as string;
  return (
    <>
      <Header />
      <Container maxWidth="xl" sx={{ p: 0, mt: 2 }}>
        {includeTopAd && <Box>{getThinHorizontalBanner(locale)}</Box>}
        <Grid container spacing={2} columns={16} sx={{ mx: 0 }}>
          {children}
        </Grid>
      </Container>
      {includeBottomAd && (
        <Box sx={{ mt: 5 }}>{getThickHorizontalBanner(locale)}</Box>
      )}
      <Footer />
    </>
  );
}
