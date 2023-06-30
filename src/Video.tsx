import { useRouter } from "next/router";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import CategoryList from "@src/CategoryList";
import { convertToShortFormat, getTitle } from "@src/utils";

const MyBox = styled(Box)(() => ({
  position: "relative",
  paddingTop: "56.25%",
}));

export default function Video({ video }: { video: any }) {
  const router = useRouter();
  const locale: string = router.locale as string;
  return (
    <>
      <MyBox>
        <iframe
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: "none",
          }}
          // src={"https://www.pornhub.com/embed/" + video.id}
          src="https://www.youtube.com/embed/x6q9AxPUTOs"
          title={getTitle(video, locale)}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </MyBox>
      <Box>
        <Typography variant="h1" sx={{ my: 1.5 }}>
          {getTitle(video, locale)}
        </Typography>
        <CategoryList categories={video.categories} />
        <Box sx={{ m: 2 }} />
        <Box display="flex" justifyContent="right" marginBottom={1}>
          <Typography variant="body2" style={{ marginRight: 10 }}>
            {convertToShortFormat(video.view_count)}
          </Typography>
          <Typography variant="body2" style={{ marginRight: 10 }}>
            {convertToShortFormat(video.like_count)}
          </Typography>
          <Typography variant="body2">
            {convertToShortFormat(video.dislike_count)}
          </Typography>
        </Box>
      </Box>
    </>
  );
}
