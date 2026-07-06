import { getPropertiesAction } from "@/actions/property.actions";
import Container from "@/components/shared/Container";
import PageHeader from "@/components/shared/PageHeader";
import AdminPropertyList from "@/components/admin/AdminPropertyList";
import { PropertyStatus } from "@/types/property.types";

export const metadata = {
  title: "Admin — Properties — StayInn",
};

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminPropertiesPage({
  searchParams,
}: PageProps) {
  const { status } = await searchParams;

  const result = await getPropertiesAction({
    status: (status as PropertyStatus) || PropertyStatus.PENDING,
    limit: 50,
  });

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Container>
        <PageHeader
          title="Manage Properties"
          description="Review and approve property listings"
        />
        <AdminPropertyList
          properties={result.properties ?? []}
          currentStatus={
            (status as PropertyStatus) || PropertyStatus.PENDING
          }
        />
      </Container>
    </div>
  );
}