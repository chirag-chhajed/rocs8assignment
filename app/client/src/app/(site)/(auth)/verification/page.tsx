import VerificationForm from "./VerificationForm";

export default function App({
  searchParams,
}: {
  searchParams: { id: string; email: string };
}) {
  return <VerificationForm id={searchParams.id} email={searchParams.email} />;
}
