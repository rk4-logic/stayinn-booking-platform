import Container from "@/components/shared/Container";
import PageHeader from "@/components/shared/PageHeader";
import PropertyForm from "@/components/owner/PropertyForm";

export const metadata = {
  title: "Add Property — StayInn",
};

export default function NewPropertyPage() {
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Container>
        <PageHeader
          title="Add New Property"
          description="Fill in the details to list your property"
        />
        <PropertyForm />
      </Container>
    </div>
  );
}