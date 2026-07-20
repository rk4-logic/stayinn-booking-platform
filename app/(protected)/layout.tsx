import { auth } from "@clerk/nextjs/server";
import { syncCurrentUser } from "@/actions/user.actions";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await auth.protect();

  await syncCurrentUser();

  return <>{children}</>;
}