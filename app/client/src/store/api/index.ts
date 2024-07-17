import { env } from "@/env.mjs";
import type { RootState } from "@/store";
import { clearTokens, updateAccessToken } from "@/store/authSlice";
import {
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
  credentials: "include",
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error?.status === 403) {
    const refreshResult = (await baseQuery(
      "/auth/refresh",
      api,
      extraOptions,
    )) as {
      data: { accessToken: string } | undefined;
      error?: FetchBaseQueryError;
    };

    if (refreshResult.data) {
      api.dispatch(
        updateAccessToken({ accessToken: refreshResult.data.accessToken }),
      );
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearTokens());
    }
  }
  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["categories"],
  endpoints: (builder) => ({}),
});
