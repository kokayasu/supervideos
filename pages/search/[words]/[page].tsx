import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2";
import { GetStaticPropsContext } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Link from "next/link";
import { ParsedUrlQuery } from "querystring";

import Ads from "@src/Ads";
import CategoryList from "@src/CategoryList";
import PageContainer from "@src/PageContainer";
import VideoList from "@src/VideoList";
import { searchVideosByWords } from "@src/db";
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
    const videos = await searchVideosByWords(words, pageNum);
    const moreCategories = getPopularCategories(videos);
    const translations = await serverSideTranslations(locale as string, [
      "common",
    ]);

    return {
      props: {
        words,
        videos,
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
  moreCategories,
  page,
}: {
  words: string;
  videos: any[];
  videoCount: number;
  moreCategories: any[];
  page: number;
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
      <Grid lg={16}>
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
            <Box mt={2} display="flex" justifyContent="center">
              {page > 1 && (
                <Button variant="contained" disableElevation>
                  <Link
                    href={`/search/${words}/${page - 1}`}
                    prefetch={false}
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    Prev
                  </Link>
                </Button>
              )}
              {page > 1 && <Box mx={2}></Box>}
              <Button variant="contained" disableElevation>
                <Link
                  href={`/search/${words}/${page + 1}`}
                  prefetch={false}
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  Next
                </Link>
              </Button>
            </Box>
          </>
        )}
        <Typography variant="h4" sx={{ my: 2 }}>
          {translate(t, "RelatedCategories")}
        </Typography>
        <CategoryList categories={moreCategories} />
      </Grid>
    </PageContainer>
  );
}
