import CategoriesCard from "./CategoriesCard";

export default function App({
  searchParams,
}: {
  searchParams: { page: string };
}) {
  return <CategoriesCard page={Number.parseInt(searchParams.page)} />;
}
