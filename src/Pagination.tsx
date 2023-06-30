import Box from "@mui/material/Box";
import MuiPagination from "@mui/material/Pagination";
import MuiPaginationItem from "@mui/material/PaginationItem";
import Link from "next/link";

function renderPaginationLink(page: number | null, linkPath: string): string {
  if (page === null) {
    return "#";
  } else if (linkPath === "") {
    return `/${page}`;
  } else {
    return `${linkPath}/${page}`;
  }
}

export default function Pagination({
  page,
  linkPath,
  videoCount,
}: {
  page: number;
  linkPath: string;
  videoCount: number;
}) {
  const pageCount = Math.ceil(videoCount / 21);
  return (
    <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
      <MuiPagination
        page={page}
        count={pageCount}
        renderItem={(item) => {
          if (item.page && (item.page > 0 && item.page <= pageCount)) {
            return (
              <Link
                href={renderPaginationLink(item.page, linkPath)}
                prefetch={false}
              >
                <MuiPaginationItem {...item} />
              </Link>
            );
          }
          return <MuiPaginationItem {...item} />;
        }}
      />
    </Box>
  );
}
