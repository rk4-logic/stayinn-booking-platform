"use client";

import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import { NAV_ITEMS } from "@/lib/constants/navigation";

export default function Navbar() {
  const { isSignedIn } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.filter((item) => item.public).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-gray-600 transition-colors hover:text-gray-900"
            >
              {item.label}
            </Link>
          ))}

          {isSignedIn &&
            NAV_ITEMS.filter((item) => !item.public).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-gray-600 transition-colors hover:text-gray-900"
              >
                {item.label}
              </Link>
            ))}
        </div>

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-3 md:flex">
          {isSignedIn ? (
            <UserButton />
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </SignInButton>

              <SignUpButton mode="modal">
                <Button size="sm">
                  Sign Up
                </Button>
              </SignUpButton>
            </>
          )}
        </div>

        <MobileMenu />
      </div>
    </nav>
  );
}