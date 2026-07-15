import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Rating from "./Rating";
import { formatPropertyType } from "@/lib/utils/formatPropertyType";
import type { PropertyInfoProps } from "@/types/property.types";

export default function PropertyInfo({ property }: PropertyInfoProps) {
  const location = property.location ?? {};
  const contact = property.contact ?? {};
  const locationParts = [location.address, location.city, location.state, location.country].filter(Boolean);
  const locationText = location.formattedAddress || locationParts.join(", ") || "Location unavailable";

  return (
    <div className="space-y-6">
      {/* Type + Rating */}
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="capitalize">
          {formatPropertyType(property.propertyType || "property")}
        </Badge>
        <Rating
          rating={property.rating ?? 0}
          totalReviews={property.totalReviews ?? 0}
          size="md"
        />
      </div>

      {/* Location */}
      <div className="flex items-start gap-2 text-gray-600">
        <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
        <span className="text-sm">{locationText}</span>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          About this property
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          {property.description || "No description available yet."}
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
            <span>{contact.phone || "Phone not available"}</span>
          </div>
          {contact.whatsapp && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MessageCircle className="h-4 w-4" />
              <span>{contact.whatsapp}</span>
            </div>
          )}
          {contact.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="h-4 w-4" />
              <span>{contact.email}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}