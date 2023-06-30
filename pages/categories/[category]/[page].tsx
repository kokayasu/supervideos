import React from "react";
import { useRouter } from "next/router";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import { GetStaticPropsContext } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";

import Ads from "@src/Ads";
import PageContainer from "@src/PageContainer";
import Pagination from "@src/Pagination";
import CategoryList from "@src/CategoryList";
import VideoList from "@src/VideoList";
import {
  searchVideosByCategory,
  getVideoCountSearchByCategory,
} from "@src/db";
import {
  getPopularCategories,
  getLastPageNum,
  translate,
  translateCategory,
} from "@src/utils";

// Define props and interfaces
interface HomeProps {
  category: string;
  videos: any[];
  videoCount: number;
  moreCategories: any[];
  page: number;
}

// Function to get static paths
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

// Function to get static props
export async function getStaticProps(context: GetStaticPropsContext) {
  const { category, page } = context.params as ParsedUrlQuery;
  const { locale } = context;
  const pageNum = parseInt(page as string);
  if (!category || typeof category !== "string" || isNaN(pageNum) || pageNum <= 0) {
    return { notFound: true };
  }

  try {
    const videoCount = await getVideoCountSearchByCategory(category);
    if (pageNum > getLastPageNum(videoCount)) return { notFound: true };
    const videos = await searchVideosByCategory(category, pageNum);
    const moreCategories = getPopularCategories(videos);
    const translations = await serverSideTranslations(locale as string, ["common"]);

    return {
      props: {
        category,
        videos,
        videoCount,
        moreCategories,
        page: pageNum,
        ...translations,
      },
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Main component
export default function Home({
  category,
  videos,
  videoCount,
  moreCategories,
  page,
}: HomeProps) {
  const router = useRouter();
  const locale = router.locale as string;
  const { t } = useTranslation();
  const translatedCategory = translateCategory(category, locale);

  return (
    <PageContainer>
      <Head>
        <title>
          {translate(t, "CategorySearchPageTitle", { category: translatedCategory, page })}
        </title>
        <meta
          name="description"
          content={
            translate(t, "CategorySearchPageDescription", { category: translatedCategory, page })
          }
        />
        <meta name="keywords" content={category} />
      </Head>
      <Grid lg={12}>
        <Typography variant="h1" mt={2}>
          {translate(t, "CategoryVideos", { category: translatedCategory })}
        </Typography>
        {videos.length === 0 ? (
          <Typography mt={2}>
            {translate(t, "SearchResultNotFound", { words: category })}
          </Typography>
        ) : (
          <>
            <VideoList videos={videos} />
            <Pagination
              page={page}
              linkPath={`/categories/${category}`}
              videoCount={videoCount}
            />
          </>
        )}
        <Typography variant="h4" mt={2}>
          {translate(t, "MoreCategories")}
        </Typography>
        <CategoryList categories={moreCategories} />
      </Grid>
      <Grid lg={4}>
        <Ads />
      </Grid>
    </PageContainer>
  );
}
