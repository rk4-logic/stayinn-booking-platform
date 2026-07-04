import { Star } from "lucide-react";
import Rating from "./Rating";
import EmptyState from "@/components/shared/EmptyState";
import { MessageSquare } from "lucide-react";
import { formatDate } from "@/lib/utils/formatDate";
import type { ReviewListProps } from "@/types/review.types";

export default function ReviewList({
    reviews,
    rating,
    totalReviews,
}: ReviewListProps) {
    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Reviews</h2>
                {rating > 0 && (
                    <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{rating.toFixed(1)}</span>
                        <span className="text-gray-500 text-sm">
                            ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
                        </span>
                    </div>
                )}
            </div>

            {reviews.length === 0 ? (
                <EmptyState
                    icon={MessageSquare}
                    title="No reviews yet"
                    description="Be the first to review this property after your stay."
                />
            ) : (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={String(review._id)} className="border-b pb-6 last:border-0">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">
                                        {typeof review.userId === "object" && review.userId !== null && "firstName" in (review.userId as object)
                                            ? `${(review.userId as { firstName?: string; lastName?: string }).firstName ?? ""} ${(review.userId as { firstName?: string; lastName?: string }).lastName ?? ""}`.trim() || "Guest"
                                            : "Guest"}
                                    </p>
                                    <p className="text-gray-400 text-xs">
                                        {formatDate(review.createdAt)}
                                    </p>
                                </div>
                                <Rating rating={review.rating} size="sm" />
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {review.review}
                            </p>
                            {review.verifiedStay && (
                                <p className="text-green-600 text-xs mt-2">✓ Verified stay</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}