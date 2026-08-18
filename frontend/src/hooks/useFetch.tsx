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
        url = `https://api.bingou.alexsandrogomes.dev${url}`;
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
      config.signal = AbortSignal.timeout(10000);

      try {
        const response = await fetch(url, config);

        const statusOk = [200, 201, 400, 401];
        if (!statusOk.includes(response.status)) {
          return { message: "failed" } as T;
        }

        const json = await response.json();

        if (json.message === "Unauthorized") {
          localStorage.clear();
        }

        return json as T;
      } catch (error: unknown) {
        if (error instanceof Error) {
          return { message: `${error.message}` } as T;
        } else {
          return { message: `${error}` } as T;
        }
      }
    },
    [],
  );

  return { request };
};
