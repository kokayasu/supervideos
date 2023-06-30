import { Container, Typography } from "@mui/material";

export default function Footer() {
  return (
    <footer>
      <Container sx={{ my: 10 }}>
        <Typography variant="body2" align="center" color="textSecondary">
          &copy; {new Date().getFullYear()} SuperVideos.com All rights reserved.
        </Typography>
      </Container>
    </footer>
  );
}
