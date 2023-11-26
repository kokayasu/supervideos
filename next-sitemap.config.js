/** @type {import('next-sitemap').IConfig} */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  sitemapSize: 10000,
  exclude: ["/server-sitemap-index.xml"],
  robotsTxtOptions: {
    additionalSitemaps: [`${siteUrl}/server-sitemap-index.xml`],
  },
};