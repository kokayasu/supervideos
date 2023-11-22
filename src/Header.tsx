import SearchIcon from "@mui/icons-material/Search";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { alpha, styled } from "@mui/material/styles";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

import { getCategories, translate, translateCategory } from "./utils";

const sections: { [key: string]: string }[] = [
  { id: "home", link: "/", en: "Home", ja: "ホーム" },
  { id: "categories", link: "/", en: "Categories", ja: "カテゴリー" },
  { id: "livecam", link: "/", en: "Live Cam", ja: "ライブカメラ" },
  { id: "meetup", link: "/", en: "Online Dating", ja: "出会い" },
  { id: "onlinegame", link: "/", en: "Online Game", ja: "オンラインゲーム" },
];

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
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

const HoverPaper = styled(Paper)(({ theme }) => ({
  position: "absolute",
  zIndex: theme.zIndex.tooltip,
  left: 0,
  width: "100%",
  elevation: 0,
  boxShadow: "none",
  borderRadius: 0,
  borderTop: "1px solid #F6C7C7",
  borderBottom: "1px solid #F6C7C7",
}));

export default function Header() {
  const router = useRouter();
  const locale = router.locale as string;
  const [searchQuery, setSearchQuery] = React.useState("");
  const [show, setShow] = useState(false);

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const categories = getCategories();

  useEffect(() => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const buttonBottom = buttonRect.bottom + window.scrollY;
      const buttonHeight = buttonRect.height;

      // Calculate the top position for HoverPaper
      const topPosition = `${buttonBottom}px`;

      // Set the calculated top position
      setTopPosition(topPosition);
    }
  }, [show]);

  const [topPosition, setTopPosition] = useState("100%");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.length !== 0) {
      router.push(`/search/${searchQuery}/1`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
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
              <form onSubmit={handleSearch}>
                <TextField
                  placeholder="Search..."
                  size="small"
                  value={searchQuery}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <IconButton edge="end" aria-label="search" type="submit">
                        <SearchIcon />
                      </IconButton>
                    ),
                  }}
                  sx={{ width: "100%" }}
                />
              </form>
            </Search>
            <div style={{ flexGrow: 1 }} />
          </Toolbar>
          <Toolbar
            component="nav"
            variant="dense"
            sx={{ justifyContent: "space-around" }}
          >
            {sections.map((section) => {
              if (section.id == "categories") {
                return (
                  <Button
                    ref={buttonRef}
                    onMouseEnter={() => setShow(true)}
                    onMouseLeave={() => setShow(false)}
                    sx={{ height: 50 }}
                  >
                    {section[locale]}
                  </Button>
                );
              } else {
                return (
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
                );
              }
            })}
          </Toolbar>
        </Container>
      </AppBar>
      <HoverPaper
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        style={{
          top: topPosition,
          display: show ? "flex" : "none",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {Object.keys(categories).map((category) => {
          return (
            <MenuItem
              sx={{
                width: "calc(25% - 8px)",
              }}
              onClick={() => setShow(false)}
            >
              <Link
                key={category}
                href={"/categories/" + category + "/1"}
                prefetch={false}
                style={{ width: "100%" }}
              >
                {translateCategory(category, locale)}
              </Link>
            </MenuItem>
          );
        })}
      </HoverPaper>
    </>
  );
}
