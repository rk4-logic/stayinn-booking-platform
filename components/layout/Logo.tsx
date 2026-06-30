import Link from "next/link";
import { Building2 } from "lucide-react";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Building2 className="h-6 w-6 text-blue-600" />
      <span className="font-bold text-xl text-gray-900">StayInn</span>
    </Link>
  );
}