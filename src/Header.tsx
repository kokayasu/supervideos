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
import { BiCategory } from "react-icons/bi";
import { BsCameraVideo } from "react-icons/bs";
import { FaRegHeart } from "react-icons/fa";
import { GrHomeRounded } from "react-icons/gr";
import { IoGameControllerOutline } from "react-icons/io5";

import { getCategories, translate, translateCategory } from "./utils";

const sections: { [key: string]: any }[] = [
  { id: "home", icon: GrHomeRounded, link: "/", en: "Home", ja: "ホーム" },
  {
    id: "categories",
    icon: BiCategory,
    link: "/",
    en: "Categories",
    ja: "カテゴリー",
  },
  {
    id: "livecam",
    icon: BsCameraVideo,
    link: "/",
    en: "Live Cam",
    ja: "ライブカメラ",
  },
  {
    id: "meetup",
    icon: FaRegHeart,
    link: "/",
    en: "Online Dating",
    ja: "出会い",
  },
  {
    id: "onlinegame",
    icon: IoGameControllerOutline,
    link: "/",
    en: "Online Game",
    ja: "オンラインゲーム",
  },
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
                    key={section.id}
                    color={"inherit"}
                    ref={buttonRef}
                    onMouseEnter={() => setShow(true)}
                    onMouseLeave={() => setShow(false)}
                    sx={{ height: 50 }}
                  >
                    <section.icon style={{ marginRight: "4px" }} />
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
                    <Button color={"inherit"} sx={{ height: 50 }}>
                      <section.icon style={{ marginRight: "4px" }} />
                      {section[locale]}
                    </Button>
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
          maxHeight: "70%",
          overflowY: "auto",
        }}
      >
        {Object.keys(categories).map((category) => {
          return (
            <MenuItem
              key={category}
              sx={{
                width: "calc(20% - 8px)",
              }}
              onClick={() => setShow(false)}
            >
              <Link
                href={"/categories/" + category + "/1"}
                prefetch={false}
                style={{
                  width: "100%",
                  textDecoration: "none",
                  color: "inherit",
                }}
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
