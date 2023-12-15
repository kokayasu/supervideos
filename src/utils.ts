import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/system";

import * as categoryTranslationsJson from "@src/categoryTranslations.json";

export function generateLocalizedUrl(locale: string, path: string) {
  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (locale !== "en") {
    baseUrl += `/${locale}`;
  }

  baseUrl += `/${path}`;

  return baseUrl;
}

const categoryTranslations: { [key: string]: { [key: string]: string } } =
  categoryTranslationsJson;

export function convertToShortFormat(num: number): string {
  const million = 1000000;
  const thousand = 1000;

  if (num >= million) {
    const suffix = num % million === 0 ? "M" : "M";
    const formatted = (num / million).toFixed(1);
    return formatted + suffix;
  } else if (num >= thousand) {
    const suffix = num % thousand === 0 ? "K" : "K";
    const formatted = (num / thousand).toFixed(1);
    return formatted + suffix;
  }

  return num.toString();
}

export function translate(
  t: (key: string) => string,
  key: string,
  variables: Record<string, string | number> = {}
): string {
  let translation = t(key);

  Object.entries(variables).forEach(([variable, value]) => {
    translation = translation.replace(
      new RegExp(`{{${variable}}}`, "g"),
      String(value)
    );
  });

  return translation;
}

export function getPopularCategories(rows: any): string[] {
  const categoryCounts: Record<string, number> = {};

  for (const row of rows) {
    for (const category of row.categories) {
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    }
  }

  const sortedCategories = Object.keys(categoryCounts).sort(
    (a, b) => categoryCounts[b] - categoryCounts[a]
  );

  return sortedCategories.slice(0, 15);
}

export function getLastPageNum(videoCount: number) {
  return Math.ceil(videoCount / 30);
}

export function getTitle(video: any, locale: string) {
  const dynamicTitleKey = `title_${locale}`;
  if (video[dynamicTitleKey] && video[dynamicTitleKey].trim() !== "") {
    return video[dynamicTitleKey];
  } else {
    return video["title_orig"];
  }
}

export function getCategories() {
  return categoryTranslations;
}

export function translateCategory(category: string, locale: string): string {
  return categoryTranslations[category][locale];
}

export function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
