import { Box, Container, Typography } from "@mui/material";
import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <Box sx={{ backgroundColor: "#F6C7C7" }}>
        <Container sx={{ mt: 10, py: 5 }}>
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
