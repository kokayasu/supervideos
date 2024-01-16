import { Divider } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { GetStaticPropsContext } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useEffect, useState } from "react";

import PageContainer from "@src/PageContainer";
import Title from "@src/Title";
import Video from "@src/Video";
import VideoList from "@src/VideoList";
import { getVideoSideBanners } from "@src/adUtils";
import { searchVideoById } from "@src/opensearch";
import { getTitle, translate } from "@src/utils";

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const { id } = context.params as ParsedUrlQuery;
  const locale = context.locale as string;
  try {
    const video = await searchVideoById(id as string);
    const translations = await serverSideTranslations(locale as string, [
      "common",
    ]);

    return {
      props: {
        video,
        ...translations,
      },
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export default function Home({ video }: { video: any }) {
  const { t } = useTranslation();
  const router = useRouter();
  const locale: string = router.locale as string;
  const title = getTitle(video, locale);
  const [moreVideos, setMoreVideos] = useState<any[]>([]);

  useEffect(() => {
    const fetchMoreVideos = async () => {
      try {
        const title = getTitle(video, locale);
        const response = await fetch(
          `/api/search-related-videos?title=${title}&id=${video.id}&locale=${locale}`
        );
        const { videos } = await response.json();
        setMoreVideos(videos);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMoreVideos();
  }, [video, locale]);

  return (
    <PageContainer includeTopAd={false}>
      <Head>
        <title>{title + " | VideoPurple"}</title>
        <meta
          name="description"
          content={translate(t, "VideoPageDescription", {
            title: title,
            categories: video.categories.join(", "),
          })}
        />
        <meta name="keywords" content={video.categories.join(", ")} />
      </Head>
      <Grid lg={12} sx={{ p: { xs: 0, sm: 1 } }}>
        <Video video={video} />
        <Divider sx={{ my: 2 }} />
      </Grid>
      <Grid xs={16} lg={4} sx={{ p: { xs: 0, sm: 1 } }}>
        {getVideoSideBanners(locale)}
      </Grid>
      <Grid lg={16}>
        <Title title={translate(t, "MoreVideos")} />
        <VideoList videos={moreVideos} />
      </Grid>
    </PageContainer>
  );
}
