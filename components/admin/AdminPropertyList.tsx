"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Check, X, Star, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/shared/EmptyState";
import {
  approvePropertyAction,
  rejectPropertyAction,
  toggleFeaturedAction,
} from "@/actions/property.actions";
import { PROPERTY_STATUS_COLORS } from "@/lib/constants/status";
import { formatPropertyType } from "@/lib/utils/formatPropertyType";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { PropertyStatus } from "@/types/property.types";
import type { IProperty } from "@/types/property.types";

type AdminProperty = Pick<
  IProperty,
  | "_id"
  | "name"
  | "slug"
  | "propertyType"
  | "status"
  | "startingPrice"
  | "currency"
  | "isFeatured"
  | "totalReviews"
  | "rating"
  | "images"
  | "location"
>;

interface AdminPropertyListProps {
  properties: AdminProperty[];
  currentStatus: PropertyStatus;
}

const STATUS_TABS = [
  { label: "Pending", value: PropertyStatus.PENDING },
  { label: "Approved", value: PropertyStatus.APPROVED },
  { label: "Rejected", value: PropertyStatus.REJECTED },
  { label: "Draft", value: PropertyStatus.DRAFT },
];

export default function AdminPropertyList({
  properties,
  currentStatus,
}: AdminPropertyListProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAction = async (
    id: string,
    action: "approve" | "reject" | "feature"
  ) => {
    setLoadingId(id);

    let result;
    if (action === "approve") result = await approvePropertyAction(id);
    else if (action === "reject") result = await rejectPropertyAction(id);
    else result = await toggleFeaturedAction(id);

    if (result.success) {
      toast.success(
        action === "approve"
          ? "Property approved"
          : action === "reject"
          ? "Property rejected"
          : "Featured status updated"
      );
      router.refresh();
    } else {
      toast.error("Action failed");
    }

    setLoadingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Status Tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() =>
              router.push(`/admin/properties?status=${tab.value}`)
            }
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentStatus === tab.value
                ? "bg-blue-600 text-white"
                : "bg-white border text-gray-600 hover:border-blue-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Property List */}
      {properties.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No properties found"
          description={`No ${currentStatus} properties at the moment.`}
        />
      ) : (
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
                        {property.location.city},{" "}
                        {property.location.country}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {property.isFeatured && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                          Featured
                        </span>
                      )}
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
                          PROPERTY_STATUS_COLORS[property.status] ??
                          PROPERTY_STATUS_COLORS.pending
                        }`}
                      >
                        {property.status}
                      </span>
                    </div>
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
                    {property.rating > 0 && (
                      <>
                        <span>•</span>
                        <span>★ {property.rating.toFixed(1)}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col gap-2 shrink-0">
                  {property.status === PropertyStatus.PENDING && (
                    <>
                      <Button
                        size="sm"
                        className="gap-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleAction(propertyId, "approve")}
                        disabled={isLoading}
                      >
                        <Check className="h-3 w-3" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="gap-1"
                        onClick={() => handleAction(propertyId, "reject")}
                        disabled={isLoading}
                      >
                        <X className="h-3 w-3" />
                        Reject
                      </Button>
                    </>
                  )}
                  {property.status === PropertyStatus.APPROVED && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      onClick={() => handleAction(propertyId, "feature")}
                      disabled={isLoading}
                    >
                      <Star className="h-3 w-3" />
                      {property.isFeatured ? "Unfeature" : "Feature"}
                    </Button>
                  )}
                  {property.status === PropertyStatus.REJECTED && (
                    <Button
                      size="sm"
                      className="gap-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleAction(propertyId, "approve")}
                      disabled={isLoading}
                    >
                      <Check className="h-3 w-3" />
                      Re-approve
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}