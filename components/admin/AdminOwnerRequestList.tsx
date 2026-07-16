"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  reviewOwnerRequestAction,
} from "@/actions/owner-request.actions";
import { OwnerRequestStatus, statusColors } from "@/lib/constants/status";
import { formatDate } from "@/lib/utils/formatDate";
import EmptyState from "@/components/shared/EmptyState";
import { Users } from "lucide-react";
import type { OwnerRequestType } from "@/types/owner.types";

interface AdminOwnerRequestListProps {
  requests: OwnerRequestType[];
}

export default function AdminOwnerRequestList({
  requests,
}: AdminOwnerRequestListProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleReview = async (
    requestId: string,
    status: OwnerRequestStatus.APPROVED | OwnerRequestStatus.REJECTED
  ) => {
    setLoadingId(requestId);

    const result = await reviewOwnerRequestAction(requestId, status);

    if (result.success) {
      toast.success(
        status === OwnerRequestStatus.APPROVED
          ? "Request approved — user is now an owner"
          : "Request rejected"
      );
      router.refresh();
    } else {
      toast.error(String(result.error) || "Action failed");
    }

    setLoadingId(null);
  };

  if (!requests || requests.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No owner requests"
        description="No pending owner requests at the moment."
      />
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => {
        const requestId = String(request._id);
        const isLoading = loadingId === requestId;

        return (
          <div
            key={requestId}
            className="bg-white border rounded-xl p-5 flex flex-col sm:flex-row gap-4"
          >
            {/* Info */}
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {request.businessName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {request.userId?.firstName ?? ""}{" "}
                    {request.userId?.lastName ?? ""} •{" "}
                    {request.userId?.email ?? ""}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
                    statusColors[request.status] ?? statusColors.pending
                  }`}
                >
                  {request.status}
                </span>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                <span>📞 {request.phone}</span>
                <span>🌍 {request.country}</span>
                <span>📅 {formatDate(request.createdAt)}</span>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600 italic">
                  &quot;{request.reason}&quot;
                </p>
              </div>
            </div>

            {/* Actions — only for pending */}
            {request.status === OwnerRequestStatus.PENDING && (
              <div className="flex sm:flex-col gap-2 shrink-0">
                <Button
                  size="sm"
                  className="gap-1 bg-green-600 hover:bg-green-700"
                  onClick={() =>
                    handleReview(requestId, OwnerRequestStatus.APPROVED)
                  }
                  disabled={isLoading}
                >
                  <Check className="h-3 w-3" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="gap-1"
                  onClick={() =>
                    handleReview(requestId, OwnerRequestStatus.REJECTED)
                  }
                  disabled={isLoading}
                >
                  <X className="h-3 w-3" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}