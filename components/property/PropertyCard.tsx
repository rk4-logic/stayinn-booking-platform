import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PropertyCardData } from "@/types/property.types";
import { formatPropertyType } from "@/lib/utils/formatPropertyType";
import Rating from "./Rating";
import Price from "./Price";

interface PropertyCardProps {
  property: PropertyCardData;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const coverImage =
    property.images?.find((img) => img.isCover) ?? property.images?.[0];

  return (
    <Link href={`/properties/${property.slug}`}>
      <div className="group rounded-xl overflow-hidden border bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="relative h-52 w-full overflow-hidden bg-gray-100">
          {coverImage ? (
            <Image
              src={coverImage.url}
              alt={property.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              No image
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="capitalize text-xs">
              {formatPropertyType(property.propertyType)}
            </Badge>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
              {property.name}
            </h3>
            <Rating
              rating={property.rating}
              totalReviews={property.totalReviews}
              size="sm"
            />
          </div>

          <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
            <MapPin className="h-3 w-3" />
            <span>
              {property.location.city}, {property.location.country}
            </span>
          </div>

          <Price
            amount={property.startingPrice}
            currency={property.currency}
            size="sm"
          />
        </div>
      </div>
    </Link>
  );
}