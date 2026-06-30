"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import {
  useAuth,
  UserButton,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { NAV_ITEMS } from "@/lib/constants/navigation";


export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const { isSignedIn } = useAuth();

  return (
    <div className="md:hidden relative">
      <button
        type="button"
        aria-label="Toggle menu"
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {open && (
        <div className="absolute top-16 left-0 right-0 z-50 flex flex-col gap-4 border-b bg-white px-4 py-6 shadow-lg">

          {/* Public navigation */}
          {NAV_ITEMS.filter((item) => item.public).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-gray-600 hover:text-gray-900"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {isSignedIn ? (
            <>
              {/* Protected navigation */}
              {NAV_ITEMS.filter((item) => !item.public).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-gray-600 hover:text-gray-900"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <div className="pt-2">
                <UserButton />
              </div>
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                >
                  Sign In
                </Button>
              </SignInButton>

              <SignUpButton mode="modal">
                <Button
                  size="sm"
                  className="w-full"
                >
                  Sign Up
                </Button>
              </SignUpButton>
            </>
          )}
        </div>
      )}
    </div>
  );
}