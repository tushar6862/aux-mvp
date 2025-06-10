'use client';
// TODO Review pending after reveiw remove todo
import { useRouter } from 'next/navigation';

/**
 * Custom hook for handling navigation with query parameters in Next.js.
 * @returns {Object} An object containing functions for navigation operations.
 */
function useQueryParam(): {
  push: (pathName: string, extraArgument?: IExtraArgument) => void;
  replace: (pathName: string, extraArgument?: IExtraArgument) => void;
  back: () => void;
  forward: () => void;
  prefetch: (
    pathName: string,
    extraArgument?: { query?: Record<string, TQueryParam> },
  ) => void;
} {
  const router = useRouter();

  /**
   * Updates query object with values from the current URL's query string.
   * Merges existing key-value pairs if present.
   * @param query The query object to update.
   */

  const returnOldQuery = (query: Record<string, TQueryParam>) => {
    const oldQuery = window?.location?.search?.substring?.(1);
    const keyValuePair = oldQuery?.split?.('&');
    keyValuePair.forEach((pair) => {
      const [key, value] = pair.split('=');
      if (key && (query[key] === undefined || null)) {
        query[key] = value;
      }
    });
  };

  /**
   * Constructs a URL with query parameters.
   * @param {string} pathName - The path name to navigate to.
   * @param {Object} query - The query parameters.
   * @param {boolean} [isPrevQueryReplace=true] - If false, replace previous query params other wise append with prev quey
   * @returns {string} The constructed URL.
   */
  const getUrl = (
    pathName: string,
    query?: Record<string, TQueryParam>,
    isPrevQueryReplace = true,
  ): string => {
    if (!query) {
      return pathName;
    }
    if (isPrevQueryReplace) {
      returnOldQuery(query);
    }
    const arrOfKeys = Object.keys(query);

    const queryString = arrOfKeys.reduce((accumulator, currentValue) => {
      if (!accumulator && query[currentValue]) {
        return accumulator + `${currentValue}=${query[currentValue]}`;
      }
      if (query[currentValue] !== '')
        return accumulator + `&${currentValue}=${query[currentValue]}`;

      return accumulator;
    }, '');

    if (queryString) {
      return `${pathName}?${queryString}`;
    }
    return `${pathName}`;
  };

  /**
   * Navigates to a new URL with the specified path and query parameters.
   * @param params An object containing pathName and query parameters.
   * @param extraArgument An optional object with additional configuration options (isPrevQueryReplace).
   */

  const push = (pathName: string, extraArgument?: IExtraArgument) => {
    const url = getUrl(
      pathName,
      extraArgument?.query,
      extraArgument?.isPrevQueryReplace,
    );
    router.push(url, {
      scroll: extraArgument?.scroll ?? true,
    });
  };

  /**
   * Replaces the current URL with the specified path and query parameters.
   * @param {Object} params - An object containing pathName and query parameters.
   * @param {Object} [extraArgument] - An optional object with additional configuration options.
   */
  const replace = (pathName: string, extraArgument?: IExtraArgument) => {
    const url = getUrl(
      pathName,
      extraArgument?.query,
      extraArgument?.isPrevQueryReplace,
    );
    router.replace(url, {
      scroll: extraArgument?.scroll ?? true,
    });
  };
  /**
   * Navigates back to the previous page in the browser's history.
   */
  const back = () => {
    router.back();
  };
  /**
   * Navigates forward to the next page in the browser's history.
   */
  const forward = () => {
    router.forward();
  };

  /**
   * Prefetches the specified URL with path and query parameters.
   * Prefetching is a way to preload a route in the background before the user visits it.
   * @param {Object} params - An object containing pathName and query parameters.
   */

  const prefetch = (
    pathName: string,
    extraArgument?: { query?: Record<string, TQueryParam> },
  ) => {
    const url = getUrl(pathName, extraArgument?.query);
    router.prefetch(url);
  };

  return { push, replace, back, forward, prefetch };
}
export default useQueryParam;

export interface IExtraArgument {
  scroll?: boolean;
  isPrevQueryReplace?: boolean;
  query?: Record<string, TQueryParam>;
}

type TQueryParam = string | number | boolean;
