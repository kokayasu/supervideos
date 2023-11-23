import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useRouter } from "next/router";

import { translateCategory } from "@src/utils";

export default function CategoryList({ categories }: { categories: string[] }) {
  const router = useRouter();
  const locale = router.locale as string;

  return (
    <div style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
      {categories.map((category, index) => (
        <Link key={index} href={`/categories/${category}/1`} prefetch={false}>
          <Chip
            clickable
            color="primary"
            sx={{ mr: 0.5, mt: 0.5, px: 1, py: 2.5 }}
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
