import { useCallback } from "react";

export const useFetch = () => {
  const request = useCallback(
    async <T = unknown,>(
      url: string,
      method: string = "GET",
      headers?: HeadersInit,
      body?: object,
    ): Promise<T> => {
      if (!url.includes("://")) {
        url = `https://backend-bingou.alexsandrogomes.dev${url}`;
      }

      const config: RequestInit = {
        method,
        headers: {
          "Content-type": "application/json",
          ...headers,
        },
      };

      if (method !== "GET" && body) {
        config.body = JSON.stringify(body);
      }

      config.credentials = "include";

      const response = await fetch(url, config);
      // if (!response.ok) {
      // throw new Error(
      // `Failed to request: ${response.status} ${response.statusText}`,
      // );
      // }

      const statusOk = [200, 201, 400, 401];
      if (!statusOk.includes(response.status)) {
        return { message: "failed to fetch" } as T;
      }

      const json = await response.json();
      return json as T;
    },
    [],
  );

  return { request };
};
