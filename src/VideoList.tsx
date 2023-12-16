import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { LuThumbsDown, LuThumbsUp } from "react-icons/lu";
import { SlEye } from "react-icons/sl";

import { getVideoListBanners } from "@src/adUtils";
import { convertToShortFormat, getTitle } from "@src/utils";

export default function Media({ videos }: { videos: any[] }) {
  const router = useRouter();
  const locale: string = router.locale as string;
  const isDev = process.env.NODE_ENV === "development";
  return (
    <Grid container>
      {videos.map((video, index) => {
        return (
          <>
            {index % 6 == 1 && getVideoListBanners(locale)}
            <Grid key={video.id} item xs={6} md={4} lg={3} xl={2.4}>
              <Link
                href={"/videos/" + video.id}
                prefetch={false}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <Paper variant="outlined" sx={{ m: 0.5, borderRadius: "4px" }}>
                  <Box
                    style={{
                      width: "100%",
                      height: 0,
                      // paddingTop: "56.25%",
                      paddingTop: "75%",
                      position: "relative",
                      overflow: "hidden",
                      borderTopLeftRadius: "4px",
                      borderTopRightRadius: "4px",
                    }}
                  >
                    <Image
                      priority={index <= 8}
                      src={
                        isDev
                          ? "https://i.ytimg.com/vi/pLqipJNItIo/hqdefault.jpg?sqp=-oaymwEYCNIBEHZIVfKriqkDCwgBFQAAiEIYAXAB&rs=AOn4CLBkklsyaw9FxDmMKapyBYCn9tbPNQ"
                          : video.thumbnail
                      }
                      alt={getTitle(video, locale)}
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      style={{ objectFit: "cover" }}
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
                      <Box
                        display={{ xs: "none", sm: "flex" }}
                        alignItems="center"
                      >
                        <LuThumbsDown style={{ marginRight: 4 }} />
                        <Typography variant="body2">
                          {convertToShortFormat(video.dislike_count)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Link>
            </Grid>
          </>
        );
      })}
    </Grid>
  );
}
