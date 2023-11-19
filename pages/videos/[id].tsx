import { Divider, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { GetStaticPropsContext } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";

import Ads from "@src/Ads";
import PageContainer from "@src/PageContainer";
import Video from "@src/Video";
import VideoList from "@src/VideoList";
import { searchVideoById, searchVideosByCategory } from "@src/db";
import { translate } from "@src/utils";

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const { id } = context.params as ParsedUrlQuery;
  const { locale } = context;
  try {
    const video = await searchVideoById(id as string);
    const moreVideos = await searchVideosByCategory(video.categories[0], 1);
    const translations = await serverSideTranslations(locale as string, [
      "common",
    ]);

    return {
      props: {
        video,
        moreVideos,
        ...translations,
      },
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function generateDescription(title: string, categories: string[]) {
  const tagText = categories.join(", ");
  const description = `Watch the "${title}" video for ${tagText} and more.`;
  return description;
}

export default function Home({
  video,
  moreVideos,
}: {
  video: any,
  moreVideos: any[],
}) {
  const { t } = useTranslation();
  return (
    <PageContainer>
      <Head>
        <title>{video.title_en} | SuperVideos</title>
        <meta
          name="description"
          content={translate(t, "VideoPageDescription", {
            title: video.title_en,
            categories: video.categories.join(", "),
          })}
        />
        <meta name="keywords" content={video.categories.join(", ")} />
      </Head>
      <Grid lg={12}>
        <Video video={video} />
        <Divider sx={{ my: 2 }} />
      </Grid>
      <Grid lg={4}>
        <Ads />
      </Grid>
      <Grid lg={16}>
        <Typography variant="h4" gutterBottom>
          {translate(t, "MoreVideos")}
        </Typography>
        <VideoList videos={moreVideos} />
      </Grid>
    </PageContainer>
  );
}
