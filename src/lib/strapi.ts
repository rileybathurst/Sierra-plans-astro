import querystring from "node:querystring";

interface Props {
  endpoint: string;
  query?: Record<string, string>;
  wrappedByKey?: string;
  wrappedByList?: boolean;
  fields?: string[];
}

/**
 * Fetches data from the Strapi API
 * @param endpoint - The endpoint to fetch from
 * @param query - The query parameters to add to the url
 * @param wrappedByKey - The key to unwrap the response from
 * @param wrappedByList - If the response is a list, unwrap it
 * @returns
 */
export default async function fetchApi<T>({
  endpoint,
  query,
  wrappedByKey,
  wrappedByList,
  fields,
}: Props): Promise<T> {
  if (endpoint.startsWith("/")) {
    endpoint = endpoint.slice(1);
  }

  // console.log(fields);

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

  // console.log(passedFields);

  const url = new URL(
    `${import.meta.env.STRAPI_URL}/api/${endpoint}${
      fields ? `?${passedFields}` : ""
    }`
  );

  // console.log(url);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      url.searchParams.append(key, value);
    }
  }
  const res = await fetch(url.toString());
  let data = await res.json();

  if (wrappedByKey) {
    data = data[wrappedByKey];
  }

  if (wrappedByList) {
    data = data[0];
  }

  return data as T;
}
