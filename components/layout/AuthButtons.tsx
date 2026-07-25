"use client";

import {
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function AuthButtons({ mobile = false }: { mobile?: boolean }) {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <UserButton />;
  }

  return (
    <div className={`flex ${mobile ? "flex-col gap-2" : "items-center gap-3"}`}>
      <SignInButton mode="modal">
        <Button variant="ghost" size="sm" className={mobile ? "w-full" : ""}>
          Sign In
        </Button>
      </SignInButton>

      <SignUpButton mode="modal">
        <Button size="sm" className={mobile ? "w-full" : ""}>
          Sign Up
        </Button>
      </SignUpButton>
    </div>
  );
}