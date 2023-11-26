import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import { GetStaticPropsContext } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";

import Ads from "@src/Ads";
import CategoryList from "@src/CategoryList";
import PageContainer from "@src/PageContainer";
import Pagination from "@src/Pagination";
import VideoList from "@src/VideoList";
import { getVideos } from "@src/db";
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
    const videos = await getVideos(pageNum, locale);
    const categories = getPopularCategories(videos);
    const translations = await serverSideTranslations(locale, ["common"]);

    return {
      props: {
        videos,
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
  categories,
  videos,
  page,
}: {
  categories: string[];
  videos: any[];
  page: string;
}) {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <Head>
        <title>Super Videos</title>
        <meta name="description" content="" />
        <meta name="keywords" content="" />
      </Head>
      <Grid lg={16}>
        <Typography variant="h2" mt={2}>
          {translate(t, "PopularCategories")}
        </Typography>
        <CategoryList categories={categories} />
        <Box sx={{ my: 3 }} />
        <Typography variant="h2" mt={2}>
          {translate(t, "PopularVideos")}
        </Typography>
        <VideoList videos={videos} />
        <Pagination page={parseInt(page)} linkPath={""} videoCount={3000} />
      </Grid>
    </PageContainer>
  );
}
