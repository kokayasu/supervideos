import { Box, Container, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import Link from "next/link";

import { translate } from "@src/utils";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer>
      <Container maxWidth={"md"} sx={{ mt: 6, mb: 2 }}>
        <Typography
          variant="body1"
          align="center"
          color="textSecondary"
          sx={{ fontSize: "0.75rem" }}
        >
          {translate(t, "HomePageDescription")} {translate(t, "AdsNote")}
        </Typography>
      </Container>
      <Box sx={{ backgroundColor: "#F6C7C7" }}>
        <Container sx={{ py: 5 }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <a
              href={"/sitemap.xml"}
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <Typography
                variant="body2"
                align="center"
                sx={{
                  marginRight: "16px",
                  fontWeight: "bold",
                }}
              >
                Sitemap
              </Typography>
            </a>
            <Link
              href={"/terms-of-service"}
              prefetch={false}
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <Typography
                variant="body2"
                align="center"
                sx={{ marginRight: "16px", fontWeight: "bold" }}
              >
                Terms of Service
              </Typography>
            </Link>
            <Link
              href={"/privacy-policy"}
              prefetch={false}
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <Typography
                variant="body2"
                align="center"
                sx={{ fontWeight: "bold" }}
              >
                Privacy Policy
              </Typography>
            </Link>
          </Box>
        </Container>
      </Box>

      <Container sx={{ p: 5 }}>
        <Typography variant="body2" align="center" color="textSecondary">
          &copy; {new Date().getFullYear()} videopurple.com All rights reserved.
        </Typography>
      </Container>
    </footer>
  );
}
