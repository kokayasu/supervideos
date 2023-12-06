import { Container } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Cookies from "js-cookie";
import { GetStaticPropsContext } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";

import Footer from "@src/Footer";
import { translate } from "@src/utils";

function LogoOnlyHeader() {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "white",
        borderBottom: "1px solid #F6C7C7",
      }}
    >
      <Container maxWidth="xl" sx={{ p: 0 }}>
        <Toolbar variant="dense">
          <Typography
            variant="h2"
            sx={{
              padding: "10px", // Add padding or other styles as needed
              fontWight: "bold",
              fontSize: { xs: "1rem", md: "2.2rem" },
              "& .videoText": {
                color: "#F6C7C7",
              },
              "& .purpleText": {
                color: "#4a266a",
              },
            }}
          >
            <span className="videoText">VIDEO</span>
            <span className="purpleText">PURPLE</span>
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const locale = context.locale as string;
  const translations = await serverSideTranslations(locale, ["common"]);
  return {
    props: {
      ...translations,
    },
  };
}

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();

  const handleYes = () => {
    Cookies.set("ageConfirmed", "true");
    router.push(router.query.from!.toString());
  };

  return (
    <>
      <Head>
        <title>VideoPurple</title>
        <meta name="description" content="" />
        <meta name="keywords" content="" />
      </Head>
      <LogoOnlyHeader />
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
        }}
      >
        <Typography
          variant="h1"
          sx={{ fontSize: { xs: "2.5rem" }, marginBottom: 8 }}
        >
          {translate(t, "AgeConfirmation")}
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: 4 }}
        >
          {translate(t, "AreYouLegalAge")}
        </Typography>
        <Typography
          variant="body1"
          sx={{ fontSize: "1.2rem", marginBottom: 4, textAlign: "center" }}
        >
          {translate(t, "AdultContent")}
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <a href="https://google.com">
            <Button variant="outlined" sx={{ width: 150, height: 80 }}>
              {translate(t, "No")}
            </Button>
          </a>
          <Button
            variant="contained"
            onClick={() => handleYes()}
            sx={{ width: 150, height: 80 }}
          >
            {translate(t, "Yes")}
          </Button>
        </Box>
      </Container>
      <Footer />
    </>
  );
}
