/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: "http://localhost:3000",
  generateRobotsTxt: true,
  // これは上の動的生成時には効かないが、SSGページには効果がある
  sitemapSize: 10000,
  exclude: ["/server-sitemap-index.xml"],
  robotsTxtOptions: {
    additionalSitemaps: [`http://localhost:3000/server-sitemap-index.xml`],
  },
};
