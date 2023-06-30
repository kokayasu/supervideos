const path = require("path");

module.exports = {
  debug: process.env.NODE_ENV === "development",
  i18n: {
    locales: ["en", "ja"],
    defaultLocale: "en",
  },
  localePath: path.resolve("./public/locales"),
};
