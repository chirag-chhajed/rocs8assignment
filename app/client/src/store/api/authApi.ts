import { api } from "@/store/api/index";

type SignupBody = {
  name: string;
  email: string;
  password: string;
};

type SignupResponse = {
  id: string;
};

type LoginBody = Pick<SignupBody, "email" | "password">;

type LoginResponse = {
  accessToken: string;
};

type VerifyBody = {
  id: string;
  otp: string;
};

export const authApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    signup: builder.mutation<SignupResponse, SignupBody>({
      query: ({ email, name, password }) => ({
        url: "api/auth/signup",
        method: "POST",
        body: { email, name, password },
      }),
    }),
    login: builder.mutation<LoginResponse, LoginBody>({
      query: ({ email, password }) => ({
        url: "api/auth/login",
        method: "POST",
        body: { email, password },
      }),
    }),
    verify: builder.mutation<LoginResponse, VerifyBody>({
      query: ({ id, otp }) => ({
        url: "api/auth/verify",
        method: "POST",
        body: { id, otp },
      }),
    }),
    resend: builder.mutation<SignupResponse, { email: string }>({
      query: ({ email }) => ({
        url: "api/auth/resend",
        method: "POST",
        body: { email },
      }),
    }),
    refreshToken: builder.query<{ accessToken: string }, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useVerifyMutation,
  useResendMutation,
  useRefreshTokenQuery,
} = authApi;
