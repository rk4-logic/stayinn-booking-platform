"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Edit, Trash2, Eye, BedDouble } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "../shared/ConfirmDialogue";
import { deletePropertyAction } from "@/actions/property.actions";
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
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!deletingId) return;
    setLoading(true);

    const result = await deletePropertyAction(deletingId);

    if (result.success) {
      toast.success("Property deleted successfully");
      router.refresh();
    } else {
      toast.error(String(result.error) || "Failed to delete property");
    }

    setLoading(false);
    setDeletingId(null);
  };

  return (
    <>
      <div className="space-y-4">
        {properties.map((property) => {
          const coverImage =
            property.images?.find((img: { url: string; isCover: boolean }) => img.isCover) ??
            property.images?.[0];
          const propertyId = String(property._id);

          return (
            <div
              key={propertyId}
              className="bg-white rounded-xl border p-4 flex flex-col sm:flex-row gap-4"
            >
              {/* Image */}
              <div className="relative w-full sm:w-32 h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                {coverImage ? (
                  <Image
                    src={coverImage.url}
                    alt={property.name}
                    fill
                    className="object-cover"
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
                      {property.location.city}, {property.location.country}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${PROPERTY_STATUS_COLORS[property.status] ?? PROPERTY_STATUS_COLORS.draft
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
                    {formatCurrency(property.startingPrice, property.currency)}
                    /night
                  </span>
                  <span>•</span>
                  <span>{property.totalReviews} reviews</span>
                </div>

                {property.status === PropertyStatus.REJECTED && (
                  <p className="text-xs text-red-500">
                    Your property was rejected. Please update and resubmit.
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex sm:flex-col gap-2 shrink-0">
                <Link href={`/properties/${property.slug}`}>
                  <Button variant="outline" size="sm" className="gap-1 w-full">
                    <Eye className="h-3 w-3" />
                    View
                  </Button>
                </Link>
                <Link href={`/owner/properties/${propertyId}/edit`}>
                  <Button variant="outline" size="sm" className="gap-1 w-full">
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                </Link>
                <Link href={`/owner/properties/${propertyId}/rooms`}>
                  <Button variant="outline" size="sm" className="gap-1 w-full">
                    <BedDouble className="h-3 w-3" />
                    Rooms
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  className="gap-1 w-full"
                  onClick={() => setDeletingId(propertyId)}
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
        description="Are you sure you want to delete this property? This action cannot be undone."
        confirmLabel="Delete"
        loading={loading}
      />
    </>
  );
}