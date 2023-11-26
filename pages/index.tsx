import { GetStaticPropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { getVideos } from "@src/db";
import { getPopularCategories } from "@src/utils";

import Page from "./[page]";

export async function getStaticProps(context: GetStaticPropsContext) {
  const locale = context.locale as string;
  try {
    const videos = await getVideos(1, locale);
    const categories = getPopularCategories(videos);
    const translations = await serverSideTranslations(locale, ["common"]);

    return {
      props: {
        videos,
        categories,
        page: 1,
        ...translations,
      },
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default Page;
