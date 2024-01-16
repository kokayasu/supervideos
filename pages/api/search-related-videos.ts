import { NextApiRequest, NextApiResponse } from "next";

import { searchVideosByWords } from "@src/opensearch";
import { getNumVideosInPage } from "@src/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title, id, locale } = req.query;

  try {
    const { videos } = await searchVideosByWords(
      title as string,
      locale as string,
      1,
      getNumVideosInPage(),
      "or",
      id as string
    );

    res.status(200).json({ videos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
