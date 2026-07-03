import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  rating: number;
  totalReviews?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

const textSizeMap = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export default function Rating({
  rating,
  totalReviews,
  size = "sm",
  className,
}: RatingProps) {
  if (!rating || rating === 0) return null;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Star className={cn("fill-yellow-400 text-yellow-400", sizeMap[size])} />
      <span className={cn("font-medium text-gray-700", textSizeMap[size])}>
        {rating.toFixed(1)}
      </span>
      {totalReviews !== undefined && (
        <span className={cn("text-gray-400", textSizeMap[size])}>
          ({totalReviews})
        </span>
      )}
    </div>
  );
}