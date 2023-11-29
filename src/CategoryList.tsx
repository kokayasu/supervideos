import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Link from "next/link";
import { useRouter } from "next/router";

import { translateCategory } from "@src/utils";

export default function CategoryList({ categories }: { categories: string[] }) {
  const router = useRouter();
  const locale = router.locale as string;
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div
      style={{
        overflowX: "auto",
        whiteSpace: "nowrap",
        marginBottom: isSmallScreen ? "8px" : "0",
      }}
    >
      {categories.map((category, index) => (
        <Link key={index} href={`/categories/${category}/1`} prefetch={false}>
          <Chip
            clickable
            color="primary"
            sx={{
              mr: 0.5,
              mt: 0.3,
              px: isSmallScreen ? 1 : 2,
              py: isSmallScreen ? 0.5 : 2.5,
            }}
            label={
              <Typography variant="body2" fontWeight="bold">
                {translateCategory(category, locale)}
              </Typography>
            }
          />
        </Link>
      ))}
    </div>
  );
}
