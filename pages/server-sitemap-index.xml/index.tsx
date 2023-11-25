import { GetServerSideProps } from "next";
import { getServerSideSitemapIndexLegacy } from "next-sitemap";

import { getVideoCountAll } from "@src/db";

const PAGE_SIZE = 10000;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const count = await getVideoCountAll();
  const pages = Math.ceil(count / PAGE_SIZE);

  return getServerSideSitemapIndexLegacy(
    ctx,
    [...new Array(pages)].map(
      (_, i) => `http://localhost:3000/server-sitemap/${i}.xml`
    )
  );
};

// Default export to prevent next.js errors
export default function SitemapIndex() {}
