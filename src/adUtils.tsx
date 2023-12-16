import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Image from "next/image";

export function getAdLink(id: string, locale: string) {
  if (id == "livecam") {
    return getLiveCamAdLink(locale);
  } else if (id === "meetup") {
    return getMeetupAdLink(locale);
  } else if (id === "onlinegame") {
    return getOnlineGameAdLink(locale);
  }
}

export function getLiveCamAdLink(locale: string) {
  if (locale == "ja") {
    return "https://click.dtiserv2.com/Click2/1-103-233441";
  } else {
    return "https://t.acam-2.com/295130/2676/0?bo=2779,2778,2777,2776,2775&po=6533";
  }
}

export function getMeetupAdLink(locale: string) {
  if (locale == "ja") {
    return "https://click.dtiserv2.com/Click/1-360-233441";
  } else {
    return "https://t.affenhance.com/295130/6954/0?bo=2753,2754,2755,2756&po=6456";
  }
}

export function getOnlineGameAdLink(locale: string) {
  return "https://t.aagm.link/295130/7538/0?bo=3511,3512,3521,3522";
}

export function getThinHorizontalBanner(
  locale: string,
  priority: boolean = false
) {
  if (locale === "ja") {
    return (
      <>
        <Box display={{ xs: "block", md: "none" }} sx={{ textAlign: "center" }}>
          <a
            href="https://click.dtiserv2.com/Click190/1018041-18-233441"
            target="_blank"
            rel="noopener"
          >
            <Image
              priority={priority}
              src="https://affiliate.dtiserv.com/image/1pondo/1018041.jpg"
              alt="広告"
              width={300}
              height={250}
            />
          </a>
        </Box>
        <Box display={{ xs: "none", md: "block" }} sx={{ textAlign: "center" }}>
          <a
            href="https://click.dtiserv2.com/Direct/1352031-352-233441"
            target="_blank"
            rel="noopener"
          >
            <Image
              priority={priority}
              src="https://affiliate.dtiserv.com/image/heydouga/728_90.jpg"
              alt="広告"
              width={728}
              height={90}
            />
          </a>
        </Box>
      </>
    );
  } else {
    return (
      <>
        <Box display={{ xs: "block", md: "none" }} sx={{ textAlign: "center" }}>
          <a
            href="https://t.ajrkm1.com/295130/6224/0?bo=2779,2778,2777,2776,2775&file_id=595531&po=6533&aff_sub4=AT_0002"
            target="_blank"
          >
            <Image
              priority={priority}
              src="https://www.imglnkd.com/6224/SHOWS-638_DESIGN-14568_November13th_300x250_v3.gif"
              alt="jerkmake advertisement"
              width="300"
              height="250"
            />
          </a>
        </Box>
        <Box display={{ xs: "none", md: "block" }} sx={{ textAlign: "center" }}>
          <a
            href="https://t.ajrkm1.com/295130/6224/0?bo=2779,2778,2777,2776,2775&file_id=594929&po=6533&aff_sub4=AT_0002"
            target="_blank"
          >
            <Image
              priority={priority}
              src="https://www.imglnkd.com/6224/007422A_JRKM_18_ALL_EN_125_L.gif"
              alt="jerkmake advertisement"
              width="728"
              height="90"
            />
          </a>
        </Box>
      </>
    );
  }
}

export function getThickHorizontalBanner(locale: string) {
  if (locale === "ja") {
    return (
      <>
        <Box display={{ xs: "block", md: "none" }} sx={{ textAlign: "center" }}>
          <a
            href="https://click.dtiserv2.com/Click190/1018041-18-233441"
            target="_blank"
            rel="noopener"
          >
            <Image
              alt="広告"
              src="https://affiliate.dtiserv.com/image/1pondo/1018041.jpg"
              width={300}
              height={250}
            />
          </a>
        </Box>
        <Box display={{ xs: "none", md: "block" }} sx={{ textAlign: "center" }}>
          <a
            href="https://click.dtiserv2.com/Click/1290020-290-233441"
            target="_blank"
            rel="noopener"
          >
            <Image
              alt="広告"
              src="https://affiliate.dtiserv.com/image/carib_ppv/900_250.jpg"
              width={900}
              height={250}
            />
          </a>
        </Box>
      </>
    );
  } else {
    return (
      <>
        <Box display={{ xs: "block", md: "none" }} sx={{ textAlign: "center" }}>
          <a
            href="https://t.acam-2.com/295130/7946/0?bo=2779,2778,2777,2776,2775&file_id=547013&po=6533&aff_sub4=AT_0002"
            target="_blank"
          >
            <Image
              src="https://www.imglnkd.com/7946/AliceGif300xx250.gif"
              alt="bimbim advertisement"
              width="300"
              height="250"
            />
          </a>
        </Box>
        <Box display={{ xs: "none", md: "block" }} sx={{ textAlign: "center" }}>
          <a
            href="https://t.ajrkm1.com/295130/8780/0?bo=2779,2778,2777,2776,2775&file_id=593930&po=6533&aff_sub4=AT_0002"
            target="_blank"
          >
            <Image
              src="https://www.imglnkd.com/8780/009946A_JRKM_18_ALL_EN_125_L.gif"
              alt="jarkmate advertisement"
              width="728"
              height="90"
            />
          </a>
        </Box>
      </>
    );
  }
}

function getVideoSideBanner1(locale: string) {
  const bannersJa = [
    <iframe
      key={1}
      src="https://www.mmaaxx.com/table/hey_channel/index11.html?affid=233441"
      width="300"
      height="250"
      frameBorder="no"
      title="Hey動画動画バナー"
    ></iframe>,
  ];

  const bannersDefault = [];

  if (locale === "ja") {
    const randomIndex = Math.floor(Math.random() * bannersJa.length);
    return bannersJa[randomIndex];
  } else {
    const randomIndex = Math.floor(Math.random() * bannersDefault.length);
    return bannersJa[randomIndex];
  }
}

function getVideoSideBanner2(locale: string) {
  const bannersJa = [
    <iframe
      key={1}
      src="https://www.mmaaxx.com/carib/vb/index300x250.html?affid=233441"
      width="300"
      height="250"
      frameBorder="no"
    ></iframe>,
  ];

  const bannersDefault = [];

  if (locale === "ja") {
    const randomIndex = Math.floor(Math.random() * bannersJa.length);
    return bannersJa[randomIndex];
  } else {
    const randomIndex = Math.floor(Math.random() * bannersDefault.length);
    return bannersJa[randomIndex];
  }
}

function getVideoSideBanner3(locale: string) {
  const bannersJa = [
    <a
      key={1}
      href="https://click.dtiserv2.com/Click190/1006021-6-233441"
      target="_blank"
      rel="noopener"
    >
      <Image
        src="https://affiliate.dtiserv.com/image/carib/1006021.jpg"
        alt="広告"
        width={300}
        height={250}
      />
    </a>,
    <a
      key={2}
      href="https://click.dtiserv2.com/Click190/1292019-292-233441"
      target="_blank"
      rel="noopener"
    >
      <Image
        src="https://affiliate.dtiserv.com/image/10musume/3day_300_250.jpg"
        alt="広告"
        width={300}
        height={250}
      />
    </a>,
    <a
      key={3}
      href="https://click.dtiserv2.com/Click2/1006033-6-233441"
      target="_blank"
      rel="noopener"
    >
      <Image
        src="https://affiliate.dtiserv.com/image/carib/300_250.jpg"
        alt="広告"
        width={300}
        height={250}
      />
    </a>,
  ];

  const bannersDefault = [];

  if (locale === "ja") {
    const randomIndex = Math.floor(Math.random() * bannersJa.length);
    return bannersJa[randomIndex];
  } else {
    const randomIndex = Math.floor(Math.random() * bannersDefault.length);
    return bannersJa[randomIndex];
  }
}

export function getVideoSideBanners(locale: string) {
  if (locale === "ja") {
    return (
      <Box display={{ xs: "none", lg: "block" }} sx={{ textAlign: "center" }}>
        {getVideoSideBanner1(locale)}
        {getVideoSideBanner2(locale)}
        {getVideoSideBanner3(locale)}
      </Box>
    );
  } else {
    return (
      <Box display={{ xs: "none", lg: "block" }}>
        {getVideoSideBanner1(locale)}
        {getVideoSideBanner2(locale)}
        {getVideoSideBanner3(locale)}
      </Box>
    );
  }
}

export function getVideoListBanners(locale: string) {
  const bannersJa = [
    <a
      key={1}
      href="https://click.dtiserv2.com/Click190/1006021-6-233441"
      target="_blank"
      rel="noopener"
    >
      <Image
        src="https://affiliate.dtiserv.com/image/carib/1006021.jpg"
        alt="advertisement"
        style={{ objectFit: "scale-down" }}
        fill
      />
    </a>,
    <a
      key={2}
      href="https://click.dtiserv2.com/Click/2103057-103-233441"
      target="_blank"
      rel="noopener"
    >
      <Image
        src="https://affiliate.dtiserv.com/image/dxlive/2103057.gif"
        alt="advertisement"
        style={{ objectFit: "scale-down" }}
        fill
      />
    </a>,
    <a
      key={3}
      href="https://click.dtiserv2.com/Click190/2320005-320-233441"
      target="_blank"
      rel="noopener"
    >
      <Image
        src="https://affiliate.dtiserv.com/image/paco/3day_300_250.jpg"
        alt="advertisement"
        style={{ objectFit: "scale-down" }}
        fill
      />
    </a>,
    <a
      key={4}
      href="https://click.dtiserv2.com/Click190/1292019-292-233441"
      target="_blank"
      rel="noopener"
    >
      <Image
        src="https://affiliate.dtiserv.com/image/10musume/3day_300_250.jpg"
        alt="advertisement"
        style={{ objectFit: "scale-down" }}
        fill
      />
    </a>,
    <a
      key={5}
      href="https://click.dtiserv2.com/Click2/1018023-18-233441"
      target="_blank"
      rel="noopener"
    >
      <Image
        src="https://affiliate.dtiserv.com/image/1pondo/300_250.jpg"
        alt="advertisement"
        style={{ objectFit: "scale-down" }}
        fill
      />
    </a>,
    <a
      key={6}
      href="https://click.dtiserv2.com/Click2/1006033-6-233441"
      target="_blank"
      rel="noopener"
    >
      <Image
        src="https://affiliate.dtiserv.com/image/carib/300_250.jpg"
        alt="advertisement"
        style={{ objectFit: "scale-down" }}
        fill
      />
    </a>,
  ];

  const bannersDefault = [
    <a
      key={1}
      href="https://t.acam-2.com/295130/1639/0?bo=2779,2778,2777,2776,2775&file_id=180980&po=6533&aff_sub4=AT_0002"
      target="_blank"
    >
      <Image
        src="https://www.imglnkd.com/1639/002807A_SODA_18_ALL_EN_71_E.gif"
        alt="cam soda advertisement"
        style={{ objectFit: "scale-down" }}
        fill
      />
    </a>,
    <a
      key={2}
      href="https://t.acam-2.com/295130/1639/0?bo=2779,2778,2777,2776,2775&file_id=180955&po=6533&aff_sub4=AT_0002"
      target="_blank"
    >
      <Image
        src="https://www.imglnkd.com/1639/002804A_SODA_18_ALL_EN_71_E.gif"
        alt="cam soda advertisement"
        style={{ objectFit: "scale-down" }}
        fill
      />
    </a>,
    <a
      key={3}
      href="https://t.acam-2.com/295130/1639/0?bo=2779,2778,2777,2776,2775&file_id=181005&po=6533&aff_sub4=AT_0002"
      target="_blank"
    >
      <Image
        src="https://www.imglnkd.com/1639/002812A_SODA_18_ALL_EN_71_E.gif"
        alt="cam soda advertisement"
        style={{ objectFit: "scale-down" }}
        fill
      />
    </a>,
  ];

  let adComponent = null;
  if (locale === "ja") {
    const randomIndex = Math.floor(Math.random() * bannersJa.length);
    adComponent = bannersJa[randomIndex];
  } else {
    const randomIndex = Math.floor(Math.random() * bannersDefault.length);
    adComponent = bannersDefault[randomIndex];
  }

  return (
    <Grid item xs={6} md={4} lg={3} xl={2.4}>
      <Paper variant="outlined" sx={{ m: 0.5, borderRadius: "4px" }}>
        <Box
          style={{
            position: "relative",
            overflow: "hidden",
            borderTopLeftRadius: "4px",
            borderTopRightRadius: "4px",
          }}
        >
          <div
            style={{
              paddingTop: "75%",
              position: "relative",
              backgroundColor: "black",
            }}
          >
            {adComponent}
          </div>
        </Box>
        <Box sx={{ p: 1 }}>
          <Typography
            gutterBottom
            variant="h5"
            overflow="hidden"
            textOverflow="ellipsis"
            sx={{ height: "2.7em" }}
          ></Typography>
          <Box display="flex" alignItems="center">
            <Box display="flex" alignItems="left">
              <Typography variant="body2">Advertisement</Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
}
