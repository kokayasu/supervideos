import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import { GetStaticPropsContext } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";

import CategoryList from "@src/CategoryList";
import PageContainer from "@src/PageContainer";
import Pagination from "@src/Pagination";
import Title from "@src/Title";
import VideoList from "@src/VideoList";
import { getVideoCountSearchByCategory, searchVideosByCategory } from "@src/db";
import {
  getLastPageNum,
  getPopularCategories,
  shuffleArray,
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
  const locale = context.locale as string;
  const pageNum = parseInt(page as string);
  if (
    !category ||
    typeof category !== "string" ||
    isNaN(pageNum) ||
    pageNum <= 0
  ) {
    return { notFound: true };
  }

  try {
    const videoCount = await getVideoCountSearchByCategory(category);
    if (pageNum > getLastPageNum(videoCount)) return { notFound: true };
    const videos = shuffleArray(
      await searchVideosByCategory(locale, category, pageNum)
    );
    const moreCategories = getPopularCategories(videos);
    const translations = await serverSideTranslations(locale as string, [
      "common",
    ]);

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
          {translate(t, "CategorySearchPageTitle", {
            category: translatedCategory,
            page,
          })}
        </title>
        <meta
          name="description"
          content={translate(t, "CategorySearchPageDescription", {
            category: translatedCategory,
            page,
          })}
        />
        <meta name="keywords" content={category} />
      </Head>
      <Grid lg={16}>
        <Title
          title={translate(t, "CategoryVideos", {
            category: translatedCategory,
          })}
        />
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
        <Title title={translate(t, "MoreCategories")} />
        <CategoryList categories={moreCategories} />
      </Grid>
    </PageContainer>
  );
}
