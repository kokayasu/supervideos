import SearchIcon from "@mui/icons-material/Search";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import InputBase from "@mui/material/InputBase";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { alpha, styled } from "@mui/material/styles";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const sections = [
  { id: "home", link: "/", en: "Home", ja: "ホーム" },
  { id: "categories", link: "/", en: "Categories", ja: "カテゴリー" },
  { id: "livecam", link: "/", en: "Live Cam", ja: "ライブカメラ" },
  { id: "meetup", link: "/", en: "Online Dating", ja: "出会い" },
  { id: "onlinegame", link: "/", en: "Online Game", ja: "オンラインゲーム" },
];

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  borderColor: "black",
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("md")]: {
    marginLeft: theme.spacing(3),
    width: "50%",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function PrimarySearchAppBar() {
  const router = useRouter();
  const locale: string = router.locale as string;
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.length != 0) {
      router.push(`/search/${searchQuery}/1`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <AppBar position="static" elevation={0}>
      <Container maxWidth="xl" sx={{ p: 0 }}>
        <Toolbar variant="dense">
          <Typography
            variant="h1"
            sx={{ mr: 2, display: { xs: "block", sm: "none" } }}
          >
            SV
          </Typography>
          <Typography
            variant="h1"
            sx={{ mr: 2, display: { xs: "none", sm: "block" } }}
          >
            SuperVideos
          </Typography>
          <div style={{ flexGrow: 0.5 }} />
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              value={searchQuery}
              onChange={handleChange}
            />
          </Search>
          <div style={{ flexGrow: 1 }} />
        </Toolbar>
        <Toolbar
          component="nav"
          variant="dense"
          sx={{ justifyContent: "space-around" }}
        >
          {sections.map((section) => (
            <Link
              key={section.id}
              href={section.link}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <Typography variant="body2" fontWeight="bold">
                {section[locale]}
              </Typography>
            </Link>
          ))}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
