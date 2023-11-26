import { GetServerSideProps } from "next";
import { getServerSideSitemapIndexLegacy } from "next-sitemap";

import { getVideoCountAll } from "@src/db";

const PAGE_SIZE = 10000;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const locale = ctx.locale as string;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const count = await getVideoCountAll(locale);
  const pages = Math.ceil(count / PAGE_SIZE);
  const xmls = [];
  if (locale === "en") {
    for (let i = 1; i <= pages; i += 1) {
      xmls.push(`${siteUrl}/server-sitemap.xml/${i}`);
    }
  } else {
    for (let i = 1; i <= pages; i += 1) {
      xmls.push(`${siteUrl}/${locale}/server-sitemap.xml/${i}`);
    }
  }

  return getServerSideSitemapIndexLegacy(ctx, xmls);
};

export default function SitemapIndex() {}
