import { GetServerSideProps } from "next";
import { getServerSideSitemapLegacy } from "next-sitemap";
import { useRouter } from "next/router";

import { getVideos } from "@src/db";

function escapeXml(xmlString: string): string {
  return xmlString.replace(/[<>&"']/g, (match) => {
    switch (match) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case '"':
        return "&quot;";
      case "'":
        return "&apos;";
      default:
        return match;
    }
  });
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const locale = ctx.locale as string;

  const page = parseInt(ctx.params?.page as string);
  if (typeof page === "undefined" || isNaN(page)) throw Error();

  const fields = [];
  const videos = await getVideos(page);
  for (const video of videos) {
    const title = escapeXml(video[`title_${locale}`]);
    const v = `
<video:thumnail_loc>${video.thumbnail}</video:thumnail_loc>
<video:title>${title}</video:title>
<video:description>${title}</video:description>
<video:player_loc>https://www.pornhub.com/embed/${video.id}</video:player_loc>
    `;
    fields.push({
      loc: `https://example.com/videos/${video.id}`,
      lastmod: new Date().toISOString(),
      "video:video": v,
    });
  }
  return getServerSideSitemapLegacy(ctx, fields);
};

// Default export to prevent next.js errors
export default function Sitemap() {}
