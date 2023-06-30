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
import { searchVideosByWords, getVideoCountSearchByWords } from "@src/db";
import { getPopularCategories, translate } from "@src/utils";

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const { words, page } = context.params as ParsedUrlQuery;
  const locale = context.locale as string;
  const pageNum = parseInt(page as string);
  if (!words || typeof words !== "string" || isNaN(pageNum) || pageNum <= 0) {
    return { notFound: true };
  }

  try {
    const videos = await searchVideosByWords(words, locale);
    const videoCount = await getVideoCountSearchByWords(words);
    const moreCategories = getPopularCategories(videos);
    const translations = await serverSideTranslations(locale as string, ["common"]);

    return {
      props: {
        words,
        videos,
        videoCount,
        moreCategories,
        page: pageNum,
        ...translations,
      },
    };
  } catch (error) {
    console.error("Error occurred during search:", error);
    throw new Error("Failed to retrieve search results.");
  }
}

export default function Home({
  words,
  videos,
  videoCount,
  moreCategories,
  page,
}: {
  words: string;
  videos: any[];
  videoCount: number;
  moreCategories: any[];
  page: string;
}) {
  const { t } = useTranslation();
  return (
    <PageContainer>
      <Head>
        <title>{translate(t, "SearchPageTitle", { words, page })}</title>
        <meta
          name="description"
          content={translate(t, "SearchPageDescription", { words, page })}
        />
        <meta name="keywords" content={words.replaceAll(" ", ", ")} />
      </Head>
      <Grid lg={12}>
        {videos.length == 0 ? (
          <Typography variant="h4" my={2}>
            {translate(t, "SearchReultNotFound", { words })}
          </Typography>
        ) : (
          <>
            <Typography variant="h1" my={2}>
              {translate(t, "SearchResult", { words })}
            </Typography>
            <VideoList videos={videos} />
            <Pagination page={parseInt(page)} linkPath={`/search/${words}`} videoCount={videoCount} />
          </>
        )}
        <Typography variant="h4" sx={{ my: 2 }}>
          {translate(t, "RelatedCategories")}
        </Typography>
        <CategoryList categories={moreCategories} />
      </Grid>
      <Grid lg={4}>
        <Ads />
      </Grid>
    </PageContainer>
  );
}
