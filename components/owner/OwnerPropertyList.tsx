"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Edit, Trash2, Eye, BedDouble, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "../shared/ConfirmDialogue";
import { deletePropertyAction, submitPropertyForReviewAction } from "@/actions/property.actions";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatPropertyType } from "@/lib/utils/formatPropertyType";
import { PropertyStatus } from "@/types/property.types";
import type { IProperty } from "@/types/property.types";
import { PROPERTY_STATUS_COLORS } from "@/lib/constants/status";

type OwnerProperty = Pick<IProperty, "_id" | "name" | "slug" | "propertyType" | "status" | "startingPrice" | "currency" | "totalReviews" | "rating" | "images" | "location">;

interface OwnerPropertyListProps {
  properties: OwnerProperty[];
}

export default function OwnerPropertyList({
  properties,
}: OwnerPropertyListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deletingId) return;
    setLoadingId(deletingId);

    const result = await deletePropertyAction(deletingId);

    if (result.success) {
      toast.success("Property deleted");
      router.refresh();
    } else {
      toast.error(String(result.error) || "Failed to delete");
    }

    setLoadingId(null);
    setDeletingId(null);
  };

  const handleSubmitForReview = async (propertyId: string) => {
    setLoadingId(propertyId);

    const result = await submitPropertyForReviewAction(propertyId);

    if (result.success) {
      toast.success("Submitted for admin review!");
      router.refresh();
    } else {
      toast.error(String(result.error) || "Failed to submit");
    }

    setLoadingId(null);
  };

  return (
    <>
      <div className="space-y-4">
        {properties.map((property) => {
          const propertyId = String(property._id);
          const coverImage =
            property.images?.find((img) => img.isCover) ??
            property.images?.[0];
          const isLoading = loadingId === propertyId;

          return (
            <div
              key={propertyId}
              className="bg-white rounded-xl border p-4 flex flex-col sm:flex-row gap-4"
            >
              {/* Image */}
              <div className="relative w-full sm:w-32 h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                {coverImage?.url ? (
                  <Image
                    src={coverImage.url}
                    alt={property.name}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                    No image
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {property.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {property.location.city},{" "}
                      {property.location.country}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium capitalize shrink-0 ${
                      PROPERTY_STATUS_COLORS[property.status] ??
                      PROPERTY_STATUS_COLORS.draft
                    }`}
                  >
                    {property.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                  <span>{formatPropertyType(property.propertyType)}</span>
                  <span>•</span>
                  <span>
                    From{" "}
                    {formatCurrency(
                      property.startingPrice,
                      property.currency
                    )}
                    /night
                  </span>
                  <span>•</span>
                  <span>{property.totalReviews} reviews</span>
                </div>

                {property.status === PropertyStatus.DRAFT && (
                  <p className="text-xs text-blue-600">
                    Add rooms then submit for review to go live.
                  </p>
                )}

                {property.status === PropertyStatus.REJECTED && (
                  <p className="text-xs text-red-500">
                    Rejected. Update details and resubmit.
                  </p>
                )}

                {property.status === PropertyStatus.PENDING && (
                  <p className="text-xs text-yellow-600">
                    Under admin review. We will notify you soon.
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex sm:flex-col gap-2 shrink-0">
                {/* Submit for review — draft only */}
                {property.status === PropertyStatus.DRAFT && (
                  <Button
                    size="sm"
                    className="gap-1 w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleSubmitForReview(propertyId)}
                    disabled={isLoading}
                  >
                    <Send className="h-3 w-3" />
                    {isLoading ? "..." : "Submit"}
                  </Button>
                )}

                {/* View — approved only */}
                {property.status === PropertyStatus.APPROVED && (
                  <Link href={`/properties/${property.slug}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 w-full"
                    >
                      <Eye className="h-3 w-3" />
                      View
                    </Button>
                  </Link>
                )}

                {/* Edit */}
                <Link href={`/owner/properties/${propertyId}/edit`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 w-full"
                    disabled={isLoading}
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                </Link>

                {/* Rooms */}
                <Link href={`/owner/properties/${propertyId}/rooms`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 w-full"
                    disabled={isLoading}
                  >
                    <BedDouble className="h-3 w-3" />
                    Rooms
                  </Button>
                </Link>

                {/* Delete */}
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-1 w-full"
                  onClick={() => setDeletingId(propertyId)}
                  disabled={isLoading}
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        open={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Property"
        description="Are you sure? This cannot be undone."
        confirmLabel="Delete"
        loading={!!loadingId}
      />
    </>
  );
}