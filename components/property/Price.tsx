import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/formatCurrency";

interface PriceProps {
  amount: number;
  currency: string;
  period?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
};

export default function Price({
  amount,
  currency,
  period = "night",
  size = "md",
  className,
}: PriceProps) {
  return (
    <div className={cn("flex items-baseline gap-1", className)}>
      <span className={cn("font-bold text-gray-900", sizeMap[size])}>
        {formatCurrency(amount, currency)}
      </span>
      <span className="text-gray-500 text-xs">/ {period}</span>
    </div>
  );
}