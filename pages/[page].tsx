import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import { GetStaticPropsContext } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";

import CategoryList from "@src/CategoryList";
import PageContainer from "@src/PageContainer";
import Pagination from "@src/Pagination";
import Title from "@src/Title";
import VideoList from "@src/VideoList";
import { getVideos } from "@src/opensearch";
import { getPopularCategories, translate } from "@src/utils";

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const { page } = context.params as ParsedUrlQuery;
  const locale = context.locale as string;
  const pageNum = parseInt(page as string);
  if (isNaN(pageNum) || pageNum <= 0) {
    return { notFound: true };
  }

  try {
    const { videoCount, videos } = await getVideos(locale, pageNum);
    const categories = getPopularCategories(videos);
    const translations = await serverSideTranslations(locale, ["common"]);

    return {
      props: {
        videos,
        videoCount,
        categories,
        page: pageNum,
        ...translations,
      },
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default function Home({
  videos,
  videoCount,
  categories,
  page,
}: {
  videos: any[];
  videoCount: number;
  categories: string[];
  page: string;
}) {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <Head>
        <title>VideoPurple</title>
        <meta
          name="description"
          content={translate(t, "HomePageDescription")}
        />
        <meta name="keywords" content="" />
      </Head>
      <Grid lg={16}>
        <Title title={translate(t, "PopularCategories")} />
        <CategoryList categories={categories} />
        <Box sx={{ my: 3 }} />
        <Title title={translate(t, "PopularVideos")} />
        <VideoList videos={videos} />
        <Pagination
          page={parseInt(page)}
          linkPath={""}
          videoCount={videoCount}
        />
      </Grid>
    </PageContainer>
  );
}
