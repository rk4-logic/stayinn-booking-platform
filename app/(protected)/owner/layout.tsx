import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/actions/user.actions";
import { UserRole } from "@/types/user.types";
import { LayoutDashboard } from "lucide-react";
import { OWNER_NAV } from "@/lib/constants/navigation";
import Link from "next/link";

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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-56 shrink-0 bg-white border-r py-6 px-4 hidden md:block">
        <div className="flex items-center gap-2 mb-8 px-2">
          <LayoutDashboard className="h-5 w-5 text-blue-600" />
          <span className="font-bold text-gray-900">Owner Panel</span>
        </div>
        <nav className="space-y-1">
          {OWNER_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}