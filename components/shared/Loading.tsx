import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  text?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-10 w-10",
};

export default function Loading({
  text,
  className,
  size = "md",
}: LoadingProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-20 gap-3", className)}>
      <Loader2 className={cn("animate-spin text-blue-600", sizeMap[size])} />
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  );
}