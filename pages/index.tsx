import { GetStaticPropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { getVideos } from "@src/opensearch";
import { getPopularCategories } from "@src/utils";

import Page from "./[page]";

export async function getStaticProps(context: GetStaticPropsContext) {
  const locale = context.locale as string;
  try {
    const { videoCount, videos } = await getVideos(locale, 1);
    const categories = getPopularCategories(videos);
    const translations = await serverSideTranslations(locale, ["common"]);

    return {
      props: {
        videos,
        videoCount,
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
