import {
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

interface LanguageOption {
  code: string; // Added the 'code' property to match the original structure
  name: string;
  flag: string;
}

const languageOptions: Record<string, LanguageOption> = {
  en: { code: "en", name: "English", flag: "🇺🇸" },
  ja: { code: "ja", name: "日本語", flag: "🇯🇵" },
};

export default function LanguageDropdown() {
  const router = useRouter();
  const locale = router.locale as string;
  function handleLanguageChange(event: SelectChangeEvent<string>) {
    const selectedLocale = event.target.value as string;
    router.push(router.pathname, router.asPath, { locale: selectedLocale });
  }

  return (
    <Box margin={1}>
      <Select
        labelId="language-select-label"
        id="language-select"
        value={locale} // Changed defaultValue to value
        onChange={handleLanguageChange}
        size="small"
      >
        {Object.values(languageOptions).map((language) => (
          <MenuItem key={language.code} value={language.code}>
            <Typography variant="h3" sx={{ lineHeight: 2 }}>
              {language.flag} {language.name}
            </Typography>
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}
