import { Suspense } from "react";
import { getPropertiesAction } from "@/actions/property.actions";
import PropertyCard from "@/components/property/PropertyCard";
import PropertyCardSkeleton from "@/components/property/PropertyCardSkeleton";
import EmptyState from "@/components/shared/EmptyState";
import Container from "@/components/shared/Container";
import PageHeader from "@/components/shared/PageHeader";
import PropertyFilters from "@/components/property/PropertyFilters";
import PropertyPagination from "@/components/property/PropertyPagination";
import { toPropertyCardData } from "@/lib/mappers";
import { Hotel } from "lucide-react";
import { PropertyType } from "@/types/property.types";
import type { PropertyCardInput } from "@/types/property.types";

interface PageProps {
  searchParams: Promise<{
    city?: string;
    country?: string;
    propertyType?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  }>;
}

export const metadata = {
  title: "Properties — StayInn",
  description: "Browse hotels, villas and apartments worldwide",
};

async function PropertiesGrid({
  searchParams,
}: {
  searchParams: Awaited<PageProps["searchParams"]>;
}) {
  const page = Number(searchParams.page) || 1;

  const result = await getPropertiesAction({
    city: searchParams.city,
    country: searchParams.country,
    propertyType: searchParams.propertyType as PropertyType | undefined,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    page,
    limit: 12,
  });

  if (!result.properties || result.properties.length === 0) {
    return (
      <EmptyState
        icon={Hotel}
        title="No properties found"
        description="Try adjusting your filters or search in a different location."
        actionLabel="Clear filters"
        actionHref="/properties"
      />
    );
  }

  return (
    <>
      <p className="text-sm text-gray-500 mb-6">
        {result.total} {result.total === 1 ? "property" : "properties"} found
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {result.properties.map((property) => (
          <PropertyCard
            key={String(property._id)}
            property={toPropertyCardData(property as unknown as PropertyCardInput)}
          />
        ))}
      </div>
      <PropertyPagination
        page={result.page}
        totalPages={result.totalPages}
        hasNextPage={result.hasNextPage}
        hasPrevPage={result.hasPrevPage}
      />
    </>
  );
}

function PropertiesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default async function PropertiesPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Container>
        <PageHeader
          title="All Properties"
          description="Discover your perfect stay from our curated listings"
        />
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 shrink-0">
            <PropertyFilters />
          </aside>
          <div className="flex-1">
            <Suspense fallback={<PropertiesGridSkeleton />}>
              <PropertiesGrid searchParams={params} />
            </Suspense>
          </div>
        </div>
      </Container>
    </div>
  );
}