import { api } from "@/store/api/index";

export const authApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({}),
});
