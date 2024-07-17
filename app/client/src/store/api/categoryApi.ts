import type { RootState } from "@/store";
import { api } from "@/store/api/index";
import { updateCurrentPage } from "@/store/currentPageSlice";

type Category = {
  id: string;
  name: string;
  isInterested: boolean;
};

type CategoryResponse = {
  categories: Category[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
};

export const categoryApi = api.injectEndpoints({
  overrideExisting: false,
  endpoints: (builder) => ({
    getCategories: builder.query<CategoryResponse, { page: number }>({
      query: ({ page }) => ({
        url: "/categories",
        method: "GET",
        params: { page },
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateCurrentPage({ currentPage: data.currentPage }));
        } catch (error) {
          console.error("Failed to fetch categories", error);
        }
      },
      providesTags: ["categories"],
    }),
    updateCategory: builder.mutation<
      { message: string },
      { categoryId: string; isInterested: boolean }
    >({
      query: ({ categoryId, isInterested }) => ({
        url: `/categories/update/${categoryId}`,
        method: "POST",
        body: { isInterested },
      }),
      async onQueryStarted(
        { categoryId, isInterested },
        { dispatch, queryFulfilled, getState }
      ) {
        // Optimistic update
        const state = getState() as RootState;
        // console.log("onQueryStarted triggered");
        const currentPage = state.page.currentPage;
        const patchResult = dispatch(
          categoryApi.util.updateQueryData(
            "getCategories",
            { page: currentPage },
            (draft) => {
              const category = draft.categories.find(
                (c) => c.id === categoryId
              );
              if (category) {
                category.isInterested = isInterested;
              }
            }
          )
        );
        try {
          // console.log("Waiting for query to fulfill");
          await queryFulfilled;
          // console.log("Query fulfilled successfully");
        } catch {
          // If the mutation fails, revert the optimistic update
          // console.error("Mutation failed, reverting optimistic update");
          patchResult.undo();
        }
      },
      invalidatesTags: ["categories"],
    }),
  }),
});

export const { useGetCategoriesQuery, useUpdateCategoryMutation } = categoryApi;
