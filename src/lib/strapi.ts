import querystring from "node:querystring";

interface Props {
  endpoint: string;
  query?: Record<string, string>;
  wrappedByKey?: string;
  wrappedByList?: boolean;
  fields?: string[];
  more?: boolean;
}

/**
 * Fetches data from the Strapi API
 * @param endpoint - The endpoint to fetch from
 * @param query - The query parameters to add to the url
 * @param wrappedByKey - The key to unwrap the response from
 * @param wrappedByList - If the response is a list, unwrap it
 * @param more - If true, fetch more data
 * @returns
 */
export default async function fetchApi<T>({
  endpoint,
  wrappedByKey,
  fields,
  more,
}: Props): Promise<T> {
  if (endpoint.startsWith("/")) {
    endpoint = endpoint.slice(1);
  }

  const keyValueFields = fields?.map((field, index) => {
    return {
      name: field,
      number: index,
    };
  });

  const passedFields = querystring.stringify(
    // populate[areas]=true
    keyValueFields?.reduce((acc, field) => {
      acc[`populate[${field.name}]`] = "true";
      return acc;
    }, {} as Record<string, string>)
  );

  // the questions mark is always needed but its fine to run it straight into an ampersand
  // http://45.79.101.19:1340/api/plans?&pagination[pageSize]=100

  // 100 is max page size
  const url = new URL(
    `${import.meta.env.STRAPI_URL}/api/${endpoint}?${
      fields ? `${passedFields}` : ""
    }${more ? `&pagination[pageSize]=100&pagination[page]=100` : ""}`
  );

  let allData: T[] = [];
  let page = 1;
  let hasMore = more;

  while (hasMore) {
    url.searchParams.set("pagination[page]", page.toString());

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${import.meta.env.STRAPI_TOKEN}`,
      },
    });
    // const { data, meta } = await res.json();

    const pageData = await res.json();

    if (wrappedByKey) {
      allData = allData.concat(pageData[wrappedByKey]);
    } else {
      allData = allData.concat(pageData);
    }

    hasMore =
      pageData.meta.pagination.page < pageData.meta.pagination.pageCount;
    page++;
  }

  return allData as T;
}
