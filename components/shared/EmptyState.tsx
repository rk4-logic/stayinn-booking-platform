import { LucideIcon, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: LucideIcon;
}

export default function EmptyState({
  title = "Nothing found",
  description = "Try adjusting your search or filters.",
  actionLabel,
  actionHref,
  icon: Icon = SearchX,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm max-w-sm mb-6">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button>{actionLabel}</Button>
        </Link>
      )}
    </div>
  );
}