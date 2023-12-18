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

import CategoryList from "@src/CategoryList";
import PageContainer from "@src/PageContainer";
import Title from "@src/Title";
import VideoList from "@src/VideoList";
import { getTopCategories, searchVideosByWords } from "@src/db";
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
    if (pageNum > 1 && videos.length === 0) {
      const encodedWords = encodeURIComponent(words as string);
      return {
        redirect: {
          destination: `/${locale}/search/${encodedWords}/1`,
          permanent: false,
        },
      };
    }
    const nextPagevideos = await searchVideosByWords(words, pageNum + 1);
    const moreCategories = getPopularCategories(videos);
    const nextPageExist = nextPagevideos.length > 0;
    const otherCategories = [];
    for (const row of await getTopCategories()) {
      otherCategories.push(row.id);
    }

    const translations = await serverSideTranslations(locale as string, [
      "common",
    ]);

    return {
      props: {
        words,
        videos,
        moreCategories,
        otherCategories,
        page: pageNum,
        nextPageExist,
        ...translations,
      },
    };
  } catch (error) {
    console.error("Error occurred during search:", error);
    throw new Error("Failed to retrieve search results.");
  }
}

export default function SearchByWords({
  words,
  videos,
  moreCategories,
  otherCategories,
  page,
  nextPageExist,
}: {
  words: string;
  videos: any[];
  videoCount: number;
  moreCategories: any[];
  otherCategories: any[];
  page: number;
  nextPageExist: boolean;
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
          <>
            <Title title={translate(t, "SearchResult", { words })} />
            {page == 1 ? (
              <Typography sx={{ mb: 10 }}>
                {translate(t, "SearchResultNotFound", { words })}
              </Typography>
            ) : (
              <Typography sx={{ mb: 10 }}>
                hello???
                {translate(t, "SearchResultNotFound", { words })}
              </Typography>
            )}
            <Title title={translate(t, "MoreCategories")} />
            <CategoryList categories={otherCategories} />
          </>
        ) : (
          <>
            <Title title={translate(t, "SearchResult", { words })} />
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
              {page > 1 && nextPageExist && <Box mx={2}></Box>}
              {nextPageExist && (
                <Button variant="contained" disableElevation>
                  <Link
                    href={`/search/${words}/${page + 1}`}
                    prefetch={false}
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    Next
                  </Link>
                </Button>
              )}
            </Box>
            <Title title={translate(t, "RelatedCategories")} />
            <CategoryList categories={moreCategories} />
          </>
        )}
      </Grid>
    </PageContainer>
  );
}
