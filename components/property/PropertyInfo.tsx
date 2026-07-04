import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Rating from "./Rating";
import { formatPropertyType } from "@/lib/utils/formatPropertyType";
import type { PropertyInfoProps } from "@/types/property.types";

export default function PropertyInfo({ property }: PropertyInfoProps) {
  return (
    <div className="space-y-6">
      {/* Type + Rating */}
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="capitalize">
          {formatPropertyType(property.propertyType)}
        </Badge>
        <Rating
          rating={property.rating}
          totalReviews={property.totalReviews}
          size="md"
        />
      </div>

      {/* Location */}
      <div className="flex items-start gap-2 text-gray-600">
        <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
        <span className="text-sm">
          {property.location.formattedAddress ??
            `${property.location.address}, ${property.location.city}, ${property.location.state}, ${property.location.country}`}
        </span>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          About this property
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          {property.description}
        </p>
      </div>

      {/* Amenities */}
      {property.amenities && property.amenities.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Amenities
          </h2>
          <div className="flex flex-wrap gap-2">
            {property.amenities.map((amenity) => (
              <Badge key={amenity} variant="outline" className="text-xs">
                {amenity}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Contact */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Contact
        </h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="h-4 w-4" />
            <span>{property.contact.phone}</span>
          </div>
          {property.contact.whatsapp && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MessageCircle className="h-4 w-4" />
              <span>{property.contact.whatsapp}</span>
            </div>
          )}
          {property.contact.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="h-4 w-4" />
              <span>{property.contact.email}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}