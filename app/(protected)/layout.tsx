import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { syncCurrentUser } from "@/actions/user.actions";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  await syncCurrentUser();

  return <>{children}</>;
}