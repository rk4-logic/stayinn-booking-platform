import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/services/user.service";
import { UserRole } from "@/types/user.types";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import AuthButtons from "./AuthButtons";

export default async function Navbar() {
  const { userId } = await auth();

  let role: UserRole | null = null;

  if (userId) {
    const user = await getUserByClerkId(userId);
    role = user?.role ?? UserRole.CUSTOMER;
  }

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/properties"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            Properties
          </Link>

          {role === UserRole.ADMIN && (
            <Link
              href="/admin/properties"
              className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
            >
              Admin Dashboard
            </Link>
          )}

          {role === UserRole.OWNER && (
            <Link
              href="/owner/properties"
              className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
            >
              Owner Dashboard
            </Link>
          )}

          {role === UserRole.CUSTOMER && (
            <Link
              href="/dashboard"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex">
          <AuthButtons />
        </div>

        {/* Mobile Menu */}
        <MobileMenu role={role} />
      </div>
    </nav>
  );
}