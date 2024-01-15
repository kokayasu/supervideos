import axios, { AxiosResponse } from "axios";

export const NUM_VIDEOS_IN_PAGE = 18;
const opensearch_endpoint =
  "https://search-videopurple-uwhp3imf4bgstzu3h4rpxxb2oi.us-west-2.es.amazonaws.com";
const index_name = "videos";
const username = "videopurple";
const password = "NA7vF9j!";

export async function performQuery(
  query: any
): Promise<{ videoCount: number; videos: any[] }> {
  if (query.from + query.size > 10000) {
    query.size = 10000 - query.from;
  }
  try {
    const response: AxiosResponse = await axios.post(
      `${opensearch_endpoint}/${index_name}/_search`,
      query,
      {
        auth: {
          username,
          password,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`Took ${response.data.took}`);
    console.log(`Hits ${response.data.hits.total.value}`);
    const videoCount = response.data.hits.total.value;
    const videos = response.data.hits.hits.map((hit: any) => hit._source);
    return { videoCount, videos };
  } catch (error) {
    console.error("Error: opensearch query failed");
    throw error;
  }
}

export async function getTopCategories(): Promise<any> {
  const query = {
    size: 0,
    aggs: {
      category_aggregation: {
        terms: {
          field: "categories",
          size: 15,
        },
      },
    },
  };

  try {
    const response: AxiosResponse = await axios.post(
      `${opensearch_endpoint}/${index_name}/_search`,
      query,
      {
        auth: {
          username,
          password,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.aggregations.category_aggregation.buckets.map(
      (category: any) => category.key
    );
  } catch (error) {
    console.error("Error: opensearch query failed");
    throw error;
  }
}

export async function getVideos(
  locale: string,
  page: number,
  pageSize: number = NUM_VIDEOS_IN_PAGE
): Promise<{ videoCount: number; videos: any[] }> {
  const query = {
    size: pageSize,
    from: (page - 1) * pageSize,
    sort: [{ view_count: "desc" }],
    query: {
      bool: {
        must: [
          {
            exists: {
              field: `title_${locale}`,
            },
          },
        ],
      },
    },
  };
  return performQuery(query);
}

export async function searchVideoById(id: string): Promise<any> {
  try {
    const response: AxiosResponse = await axios.get(
      `${opensearch_endpoint}/${index_name}/_doc/${id}`,
      {
        auth: {
          username,
          password,
        },
      }
    );

    return response.data._source;
  } catch (error) {
    console.error("Error: opensearch query failed");
    throw error;
  }
}

export async function searchVideosByWords(
  words: string,
  locale: string,
  page: number,
  pageSize: number = NUM_VIDEOS_IN_PAGE,
  operator: string = "and",
  exclude_id: string | null = null
): Promise<{ videoCount: number; videos: any[] }> {
  let query: any = {
    bool: {
      must: [
        {
          multi_match: {
            query: words,
            fields: [`title_${locale}^2.0`, "title_orig"],
            operator: operator,
          },
        },
      ],
    },
  };

  if (exclude_id != null) {
    query.bool.must_not = [
      {
        term: {
          id: exclude_id,
        },
      },
    ];
  }

  const search = {
    size: pageSize,
    from: (page - 1) * pageSize,
    query: query,
  };
  return performQuery(search);
}

export async function searchVideosByCategory(
  category: string,
  locale: string,
  page: number,
  pageSize: number = NUM_VIDEOS_IN_PAGE
): Promise<{ videoCount: number; videos: any[] }> {
  const query = {
    size: pageSize,
    from: (page - 1) * pageSize,
    sort: [{ view_count: { order: "desc" } }],
    query: {
      bool: {
        must: [
          {
            term: {
              categories: category,
            },
          },
        ],
        filter: [{ exists: { field: `title_${locale}` } }],
      },
    },
  };
  return performQuery(query);
}

export async function getVideoCountAll(locale: string) {
  const query = { query: { exists: { field: `title_${locale}` } } };

  try {
    const response: AxiosResponse = await axios.post(
      `${opensearch_endpoint}/${index_name}/_count`,
      query,
      {
        auth: {
          username,
          password,
        },
      }
    );

    return response.data.count;
  } catch (error) {
    console.error("Error: opensearch query failed");
    throw error;
  }
}

async function getLastId(locale: string, page: number): Promise<string> {
  try {
    const response: AxiosResponse = await axios.get(
      `${opensearch_endpoint}/pagination_info_${locale}/_doc/${page}`,
      {
        auth: {
          username,
          password,
        },
      }
    );

    console.info(response.data);
    return response.data._source.last_id_value;
  } catch (error) {
    console.error("Error: opensearch query 'getLastId' failed");
    throw error;
  }
}

export async function getVideosForSitemap(
  locale: string,
  page: number
): Promise<{ videoCount: number; videos: any[] }> {
  const body: any = {
    query: {
      exists: {
        field: `title_${locale}`,
      },
    },
    size: 1000,
    sort: [{ id: "asc" }],
  };
  if (page > 1) {
    const last_id_value = await getLastId(locale, page);
    body.search_after = [last_id_value];
  }
  return performQuery(body);
}
