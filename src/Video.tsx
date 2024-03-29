import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { LuThumbsDown, LuThumbsUp } from "react-icons/lu";
import { SlEye } from "react-icons/sl";

import CategoryList from "@src/CategoryList";
import { convertToShortFormat, generateVideoSrc, getTitle } from "@src/utils";

export default function Video({ video }: { video: any }) {
  const router = useRouter();
  const locale: string = router.locale as string;
  return (
    <>
      <Box
        sx={{
          position: "relative",
          // paddingTop: "56.25%",
          paddingTop: "65.5%",
        }}
      >
        <iframe
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
          }}
          src={generateVideoSrc(video)}
          title={getTitle(video, locale)}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
          allowFullScreen
        ></iframe>
      </Box>
      <Box sx={{ p: { xs: 1, sm: 0 } }}>
        <Typography variant="h1" sx={{ my: 1.5 }}>
          {getTitle(video, locale)}
        </Typography>
        <CategoryList categories={video.categories} />
        <Box sx={{ m: 2 }} />

        <Box display="flex" alignItems="center" marginBottom={1}>
          <Box display="flex" alignItems="center" marginRight={2}>
            <SlEye style={{ marginRight: 6, fontSize: "1.2rem" }} />
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              {convertToShortFormat(video.view_count)}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" marginRight={2}>
            <LuThumbsUp style={{ marginRight: 6, fontSize: "1.2rem" }} />
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              {convertToShortFormat(video.like_count)}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <LuThumbsDown style={{ marginRight: 6, fontSize: "1.2rem" }} />
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              {convertToShortFormat(video.dislike_count)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
}
