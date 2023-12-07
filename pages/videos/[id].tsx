import { Divider } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import { GetStaticPropsContext } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";

import PageContainer from "@src/PageContainer";
import Title from "@src/Title";
import Video from "@src/Video";
import VideoList from "@src/VideoList";
import { searchVideoById, searchVideosByCategory } from "@src/db";
import { getTitle, shuffleArray, translate } from "@src/utils";

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
    const moreVideos = shuffleArray(
      await searchVideosByCategory(locale, video.categories[0], 1)
    );
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
  video: any;
  moreVideos: any[];
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const locale: string = router.locale as string;
  const title = getTitle(video, locale);
  return (
    <PageContainer>
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
      <Grid lg={4} sx={{ p: { xs: 0, sm: 1 } }}>
        <Box sx={{ textAlign: "center" }}>
          <iframe
            src="https://sefsdvc.com/en/us/media/dynamic/id?zid=11922&pid=0&custom1=&custom2=60670&custom3=%7Btransaction_id%7D&custom6=&custom7=PUB_295130&cturl=https://t.irtyf.com/ihxg01j1ds?file_id=252623&aff_id=295130&offer_id=3788&aff_sub=&url="
            width="300"
            height="250"
          ></iframe>
          <iframe
            src="https://sefsdvc.com/en/us/media/dynamic/id?zid=11922&pid=0&custom1=&custom2=60670&custom3=%7Btransaction_id%7D&custom6=&custom7=PUB_295130&cturl=https://t.irtyf.com/ihxg01j1ds?file_id=252623&aff_id=295130&offer_id=3788&aff_sub=&url="
            width="300"
            height="250"
          ></iframe>
        </Box>
      </Grid>
      <Grid lg={16}>
        <Title title={translate(t, "MoreVideos")} />
        <VideoList videos={moreVideos} />
      </Grid>
    </PageContainer>
  );
}
