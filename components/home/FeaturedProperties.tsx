import { getPropertiesAction } from "@/actions/property.actions";
import PropertyCard from "@/components/property/PropertyCard";
import { toPropertyCardData } from "@/lib/mappers";
import { PropertyCardInput } from "@/lib/mappers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default async function FeaturedProperties() {
  const result = await getPropertiesAction({
    isFeatured: true,
    limit: 4,
  });

  const properties = result.properties ?? [];

  if (properties.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Properties
            </h2>
            <p className="text-gray-500 mt-1">
              Handpicked stays for your perfect trip
            </p>
          </div>
          <Link href="/properties">
            <Button variant="outline" className="gap-2 hidden sm:flex">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={String(property._id)}
              property={toPropertyCardData(
                property as unknown as PropertyCardInput
              )}
            />
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link href="/properties">
            <Button variant="outline" className="gap-2">
              View All Properties
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}