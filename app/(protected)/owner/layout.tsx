import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/actions/user.actions";
import { UserRole } from "@/types/user.types";

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthenticatedUser().catch(() => null);

  if (!user) redirect("/sign-in");
  if (user.role !== UserRole.OWNER && user.role !== UserRole.ADMIN) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}