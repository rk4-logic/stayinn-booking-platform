import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPropertyReviewsAction,
  createReviewAction,
  getUserReviewsAction,
} from "@/actions/review.actions";
import { CreateReviewInput } from "@/lib/validations/review.validation";
import { ONE_MINUTE, QUERY_STALE_TIME } from "@/lib/constants/query";

export const reviewKeys = {
  all: ["reviews"] as const,
  property: (propertyId: string) =>
    [...reviewKeys.all, "property", propertyId] as const,
  user: () => [...reviewKeys.all, "user"] as const,
};

export function usePropertyReviews(propertyId: string, page = 1, limit = 10) {
  return useQuery({
    queryKey: reviewKeys.property(propertyId),
    queryFn: () => getPropertyReviewsAction(propertyId, page, limit),
    enabled: !!propertyId,
    staleTime: QUERY_STALE_TIME.MEDIUM
  });
}

export function useUserReviews() {
  return useQuery({
    queryKey: reviewKeys.user(),
    queryFn: () => getUserReviewsAction(),
    staleTime: ONE_MINUTE
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewInput) => createReviewAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    },
  });
}