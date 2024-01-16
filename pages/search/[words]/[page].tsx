import Typography from "@mui/material/Typography";
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
import { getTopCategories, searchVideosByWords } from "@src/opensearch";
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
    const { videoCount, videos } = await searchVideosByWords(
      words,
      locale,
      pageNum
    );

    if (pageNum > 1 && videos.length === 0) {
      const encodedWords = encodeURIComponent(words as string);
      return {
        redirect: {
          destination: `/${locale}/search/${encodedWords}/1`,
          permanent: false,
        },
      };
    }

    const moreCategories =
      videos.length === 0
        ? await getTopCategories()
        : getPopularCategories(videos);

    const translations = await serverSideTranslations(locale as string, [
      "common",
    ]);

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

export default function SearchByWords({
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
  page: number;
}) {
  const { t } = useTranslation();
  const encodedWords = encodeURIComponent(words as string);
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
                {translate(t, "SearchResultNotFound", { words })}
              </Typography>
            )}
            <Title title={translate(t, "MoreCategories")} />
            <CategoryList categories={moreCategories} />
          </>
        ) : (
          <>
            <Title title={translate(t, "SearchResult", { words })} />
            <VideoList videos={videos} />
            <Pagination
              page={page}
              linkPath={`/search/${encodedWords}`}
              videoCount={videoCount}
            />
            <Title title={translate(t, "RelatedCategories")} />
            <CategoryList categories={moreCategories} />
          </>
        )}
      </Grid>
    </PageContainer>
  );
}
