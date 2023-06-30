import SearchIcon from "@mui/icons-material/Search";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

export default function SearchAppBar() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const router = useRouter();

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
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: "white",
        borderBottom: "1px solid #000000"
      }}
    >
      <Toolbar>
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
    </AppBar>
  );
}
