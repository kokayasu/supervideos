import Box from "@mui/material/Box";
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

export function getThinHorizontalBanner(locale: string) {
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
            href="https://click.dtiserv2.com/Direct/1352031-352-233441"
            target="_blank"
            rel="noopener"
          >
            <Image
              src="https://affiliate.dtiserv.com/image/heydouga/728_90.jpg"
              alt="広告"
              width={728}
              height={90}
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
