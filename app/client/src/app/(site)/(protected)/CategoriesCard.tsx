"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "@/store/api/categoryApi";
import { updateCurrentPage } from "@/store/currentPageSlice";
import { useAppDispatch } from "@/store/hooks";
import { useEffect, useState } from "react";

const CategoriesCard = ({ page }: { page: number }) => {
  const { data } = useGetCategoriesQuery({ page: page || 1 });
  const dispatch = useAppDispatch();
  const { categories, currentPage, hasNext, hasPrevious, totalPages } =
    data ?? {};

  useEffect(() => {
    if (currentPage) {
      dispatch(updateCurrentPage({ currentPage }));
    }
  }, [currentPage]);
  return (
    <main className="flex justify-center px-10">
      <div className="my-10 rounded-[20px] border border-neutral-300 bg-white px-16 py-10 space-y-6 lg:max-w-[576px] h-full">
        <h2 className="text-3xl font-semibold text-center ">
          Please mark your interests!
        </h2>
        <p className="text-center text-base">We will keep you notified.</p>
        <div className="space-y-6">
          <p className="font-medium text-xl">My saved interests!</p>
          {categories?.map((category) => (
            <Category key={category.id} category={category} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default CategoriesCard;

const Category = ({
  category,
}: {
  category: { id: string; name: string; isInterested: boolean };
}) => {
  const [updateCategory, { isLoading }] = useUpdateCategoryMutation();
  const handleCheckedChange = async (checked: boolean) => {
    try {
      await updateCategory({
        categoryId: category.id,
        isInterested: checked,
      }).unwrap();
    } catch (error) {
      // Handle error (e.g., show a toast notification)
      console.error("Failed to update category:", error);
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <Checkbox
        checked={category.isInterested}
        onCheckedChange={handleCheckedChange}
        id={`category_${category.id}`}
        className="w-6 h-6"
      />
      <label className="text-base" htmlFor={`category_${category.id}`}>
        {category.name}
      </label>
    </div>
  );
};
