import { getOwnerPropertiesAction } from "@/actions/property.actions";
import Container from "@/components/shared/Container";
import PageHeader from "@/components/shared/PageHeader";
import EmptyState from "@/components/shared/EmptyState";
import OwnerPropertyList from "@/components/owner/OwnerPropertyList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Hotel } from "lucide-react";
import { serializeData } from "@/lib/utils/serialize";

export const metadata = {
  title: "My Properties — StayInn",
};

export default async function OwnerPropertiesPage() {
  const properties = await getOwnerPropertiesAction();
  const serializedProperties = serializeData(properties ?? []);

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Container>
        <PageHeader
          title="My Properties"
          description="Manage your property listings"
        >
          <Link href="/owner/properties/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Property
            </Button>
          </Link>
        </PageHeader>

        {serializedProperties.length === 0 ? (
          <EmptyState
            icon={Hotel}
            title="No properties yet"
            description="Create your first property listing to start receiving bookings."
            actionLabel="Add Property"
            actionHref="/owner/properties/new"
          />
        ) : (
          <OwnerPropertyList properties={serializedProperties} />
        )}
      </Container>
    </div>
  );
}