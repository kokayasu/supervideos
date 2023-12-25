/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config.js");

module.exports = {
  i18n,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "di.phncdn.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "ei.phncdn.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "www.imglnkd.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "affiliate.dtiserv.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "*.xvideos-cdn.com",
        port: "",
        pathname: "**",
      },
    ],
  },
};
