import SearchIcon from "@mui/icons-material/Search";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useRouter } from "next/router";

import React from 'react';
import Popover from '@mui/material/Popover';
import Grid from '@mui/material/Grid';
import { Button } from "@mui/base";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const categories = [
  'Category 1',
  'Category 2',
  'Category 3',
  // Add more categories as needed
];

function CategoryLink() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <Button
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        Hover me
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}

        PaperProps={{
          style: {
            width: '100%', // Set the width to 100%
          },
        }}
      >
        <Grid container>
          {/* Create columns based on the number of categories */}
          {categories.map((category, index) => (
            <Grid item key={index} xs={4}>
              <Typography>{category}</Typography>
            </Grid>
          ))}
        </Grid>
      </Popover>
    </div>
  );
}

const sections = [
  { id: "home", link: "/", en: "Home", ja: "ホーム" },
  { id: "categories", link: "/", en: "Categories", ja: "カテゴリー" },
  { id: "livecam", link: "/", en: "Live Cam", ja: "ライブカメラ" },
  { id: "meetup", link: "/", en: "Online Dating", ja: "出会い" },
  { id: "onlinegame", link: "/", en: "Online Game", ja: "オンラインゲーム" },
]

export default function SearchAppBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handlePopoverOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const [searchQuery, setSearchQuery] = React.useState("");
  const router = useRouter();
  const locale: string = router.locale as string;

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
    <AppBar
      position={"static"}
      elevation={0}
      sx={{
        backgroundColor: "white",
        borderBottom: "1px solid #000000"
      }}
    >
      <Toolbar
        variant="dense"
      >
        <Link
          href="/"
          prefetch={false}
          style={{ color: "inherit", textDecoration: "none" }}
        >
          <Typography variant="h6">SuperVideos</Typography>
        </Link>
        <div style={{ flexGrow: 0.3 }} />
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
            sx={{
              width: "600px",
              marginLeft: "auto",
              marginRight: "auto",
              "& .MuiOutlinedInput-root.Mui-focused": {
                "& > fieldset": {
                  borderColor: "inherit",
                },
              },
            }}
          />
        </form>
        <div style={{ flexGrow: 0.5 }} />
      </Toolbar>
      <Toolbar
        component="nav"
        variant="dense"
        sx={{ justifyContent: 'space-around' }}
      >
        {sections.map((section) => (
          <Link
            key={section.id}
            href={section.link}
            style={{
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <Typography
              variant="body2" fontWeight="bold"
              onMouseEnter={handlePopoverOpen}
            >
              {section[locale]}
            </Typography>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handlePopoverClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem >Profile</MenuItem>
              <MenuItem >My account</MenuItem>
              <MenuItem >Logout</MenuItem>
            </Menu>
          </Link>
        ))}
      </Toolbar>
    </AppBar>
  );
}
