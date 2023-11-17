import * as categoryTranslationsJson from "@src/categoryTranslations.json";

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
    return video["title_original"];
  }
}

export function translateCategory(category: string, locale: string): string {
  const categoryTranslations: { [key: string]: { [key: string]: string } } = categoryTranslationsJson;
  return categoryTranslations[category][locale];
}
