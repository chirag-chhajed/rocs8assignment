import CategoriesCard from "./CategoriesCard";

export default function App({
  searchParams,
}: {
  searchParams: { page: string };
}) {
  console.log(searchParams, "searchParams");
  return <CategoriesCard page={Number.parseInt(searchParams.page)} />;
}
