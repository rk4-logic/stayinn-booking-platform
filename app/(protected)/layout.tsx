import { syncCurrentUser } from "@/actions/user.actions";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await syncCurrentUser();

  return <>{children}</>;
}