import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { LuThumbsDown, LuThumbsUp } from "react-icons/lu";
import { SlEye } from "react-icons/sl";

import { getVideoListAd } from "@src/adUtils";
import { convertToShortFormat, getTitle } from "@src/utils";

const isDev = process.env.NODE_ENV === "development";

function generateVideoListItem(components: any, key: string) {
  return (
    <Grid
      key={key}
      item
      xs={6}
      lg={3}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <Paper
        elevation={0}
        variant={key.startsWith("ad-") ? "elevation" : "outlined"}
        sx={{ m: 0.5, borderRadius: "4px", flex: 1 }}
      >
        {components}
      </Paper>
    </Grid>
  );
}

function generateVideoComponent(video: any, priority: boolean, locale: string) {
  return (
    <Link
      href={"/videos/" + video.id}
      prefetch={false}
      style={{ color: "inherit", textDecoration: "none" }}
    >
      <Box
        style={{
          width: "100%",
          height: 0,
          paddingTop: "56.25%",
          // paddingTop: "75%",
          position: "relative",
          overflow: "hidden",
          borderTopLeftRadius: "4px",
          borderTopRightRadius: "4px",
        }}
      >
        <Image
          priority={priority}
          src={
            isDev
              ? "https://i.ytimg.com/vi/pLqipJNItIo/hqdefault.jpg?sqp=-oaymwEYCNIBEHZIVfKriqkDCwgBFQAAiEIYAXAB&rs=AOn4CLBkklsyaw9FxDmMKapyBYCn9tbPNQ"
              : video.thumbnail
          }
          alt={getTitle(video, locale)}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          style={{ objectFit: "fill" }}
          fill
        />
      </Box>
      <Box sx={{ p: 1 }}>
        <Typography
          gutterBottom
          variant="h5"
          overflow="hidden"
          textOverflow="ellipsis"
          sx={{ height: "2.7em" }}
        >
          {getTitle(video, locale)}
        </Typography>
        <Box display="flex" alignItems="center">
          <Box display="flex" alignItems="center" marginRight={2}>
            <SlEye style={{ marginRight: 4 }} />
            <Typography variant="body2">
              {convertToShortFormat(video.view_count)}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" marginRight={2}>
            <LuThumbsUp style={{ marginRight: 4 }} />
            <Typography variant="body2">
              {convertToShortFormat(video.like_count)}
            </Typography>
          </Box>
          <Box display={{ xs: "none", sm: "flex" }} alignItems="center">
            <LuThumbsDown style={{ marginRight: 4 }} />
            <Typography variant="body2">
              {convertToShortFormat(video.dislike_count)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Link>
  );
}

function generateAdComponent(ad: any) {
  return (
    <Link
      href={ad.href}
      prefetch={false}
      style={{ color: "inherit", textDecoration: "none" }}
    >
      <Box
        style={{
          width: "100%",
          height: 0,
          paddingTop: "83.3%",
          position: "relative",
          overflow: "hidden",
          borderRadius: "4px",
        }}
      >
        <Image
          src={
            isDev
              ? "https://i.ytimg.com/vi/pLqipJNItIo/hqdefault.jpg?sqp=-oaymwEYCNIBEHZIVfKriqkDCwgBFQAAiEIYAXAB&rs=AOn4CLBkklsyaw9FxDmMKapyBYCn9tbPNQ"
              : ad.imageSrc
          }
          alt={ad.description}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          style={{ objectFit: "fill" }}
          fill
        />
      </Box>
    </Link>
  );
}

export default function VideoList({ videos }: { videos: any[] }) {
  const router = useRouter();
  const locale: string = router.locale as string;

  let videoList = [];
  for (let i = 0; i < videos.length; i++) {
    if (i == 3) {
      const ad = getVideoListAd(locale, 0);
      videoList.push(
        generateVideoListItem(generateAdComponent(ad), "ad-" + ad.imageSrc)
      );
    }

    videoList.push(
      generateVideoListItem(
        generateVideoComponent(videos[i], i <= 8, locale),
        videos[i].id
      )
    );
  }

  return <Grid container>{videoList}</Grid>;
}
