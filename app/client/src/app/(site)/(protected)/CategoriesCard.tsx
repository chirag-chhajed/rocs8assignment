"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { generatePageNumbers } from "@/lib/generatePageNumbers";
import {
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "@/store/api/categoryApi";

const CategoriesCard = ({ page }: { page: number }) => {
  const { data, isLoading, isFetching } = useGetCategoriesQuery({
    page: page || 1,
  });
  const { categories, currentPage, hasNext, hasPrevious, totalPages } =
    data ?? {};

  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  const paginationNumbers = generatePageNumbers(currentPage!, totalPages!);
  return (
    <main className="flex justify-center px-10">
      <div className="my-10 rounded-[20px] border border-neutral-300 bg-white px-16 py-10 space-y-6 lg:max-w-[576px] h-full">
        <h2 className="text-3xl font-semibold text-center ">
          Please mark your interests!
        </h2>
        <p className="text-center text-base">We will keep you notified.</p>
        <div className="space-y-6">
          <p className="font-medium text-xl">My saved interests!</p>
          {isLoading &&
            Array.from({ length: 6 }).map((_, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <it's static and doesn't update>
              <SkeletonCategory key={`skeleton_category_${index}`} />
            ))}
          {categories?.map((category) => (
            <Category key={category.id} category={category} />
          ))}
        </div>
        <Pagination className="text-neutral-500 justify-start">
          <PaginationContent className="gap-2">
            <PaginationItem>
              <PaginationLink href={"/?page=1"} aria-label="Go to first page">
                &lt;&lt;
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                aria-disabled={!hasPrevious}
                href={
                  hasPrevious ? `/?page=${(currentPage as number) - 1}` : ""
                }
                aria-label="Go to previous page"
              >
                &lt;
              </PaginationLink>
            </PaginationItem>
            {paginationNumbers.map((pageNumber, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <doesn't update, it's static>
              <PaginationItem key={`pagination_${index}_c`}>
                {pageNumber === "..." ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href={`?page=${pageNumber}`}
                    aria-label={`Go to page ${pageNumber}`}
                    isActive={pageNumber === currentPage}
                  >
                    {pageNumber}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationLink
                href={hasNext ? `/?page=${(currentPage as number) + 1}` : ""}
                aria-label="Go to next page"
              >
                &gt;
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationLink
                aria-disabled={!hasPrevious}
                href={`?page=${totalPages}`}
                aria-label="Go to last page"
              >
                &gt;&gt;
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
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

const SkeletonCategory = () => {
  return <Skeleton className="w-4/5 h-6" />;
};
