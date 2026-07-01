import Image from "next/image";
import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PropertyCardData } from "@/types/property.types";
import { formatCurrency } from "@/lib/utils/formatCurrency";

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
                            {property.propertyType?.replace("_", " ")}
                        </Badge>
                    </div>
                </div>

                <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                            {property.name}
                        </h3>
                        {property.rating > 0 && (
                            <div className="flex items-center gap-1 shrink-0">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-medium text-gray-700">
                                    {property.rating.toFixed(1)}
                                </span>
                                <span className="text-xs text-gray-400">
                                    ({property.totalReviews})
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-1 text-gray-500 text-xs mb-3">
                        <MapPin className="h-3 w-3" />
                        <span>
                            {property.location.city}, {property.location.country}
                        </span>
                    </div>

                    <div>
                        <span className="font-bold text-gray-900">
                            {formatCurrency(property.startingPrice, property.currency)}
                        </span>
                        <span className="text-gray-500 text-xs"> / night</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}