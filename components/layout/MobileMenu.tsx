"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { UserRole } from "@/types/user.types";
import AuthButtons from "./AuthButtons";

interface MobileMenuProps {
  role: UserRole | null;
}

export default function MobileMenu({ role }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="rounded-lg p-2 text-gray-700 hover:bg-gray-100"
        aria-label="Toggle menu"
      >
        {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Full-screen Mobile Panel */}
      {open && (
        <div className="fixed inset-x-0 top-16 z-40 border-b bg-white shadow-lg">
          <div className="max-h-[calc(100vh-4rem)] overflow-y-auto px-4 py-4">
            <div className="flex flex-col space-y-1">
              <Link
                href="/properties"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Properties
              </Link>

              {role === UserRole.ADMIN && (
                <Link
                  href="/admin/properties"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50"
                >
                  Admin Dashboard
                </Link>
              )}

              {role === UserRole.OWNER && (
                <Link
                  href="/owner/properties"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50"
                >
                  Owner Dashboard
                </Link>
              )}

              {role === UserRole.CUSTOMER && (
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Dashboard
                </Link>
              )}
            </div>

            <div className="mt-4 border-t pt-4">
              <AuthButtons mobile />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}