import { notFound } from "next/navigation";
import { getPropertyAction } from "@/actions/property.actions";
import Container from "@/components/shared/Container";
import PageHeader from "@/components/shared/PageHeader";
import PropertyForm from "@/components/owner/PropertyForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: PageProps) {
  const { id } = await params;
  const property = await getPropertyAction(id);

  if (!property) notFound();

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Container>
        <PageHeader
          title="Edit Property"
          description="Update your property details"
        />
        <PropertyForm
          propertyId={id}
          initialData={{
            name: property.name,
            description: property.description,
            propertyType: property.propertyType,
            currency: property.currency,
            location: property.location,
            contact: property.contact,
            amenities: property.amenities ?? [],
          }}
        />
      </Container>
    </div>
  );
}