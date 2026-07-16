import { getOwnerRequestsAction } from "@/actions/owner-request.actions";
import Container from "@/components/shared/Container";
import PageHeader from "@/components/shared/PageHeader";
import AdminOwnerRequestList from "@/components/admin/AdminOwnerRequestList";

export const metadata = {
  title: "Admin — Owner Requests — StayInn",
};

export default async function AdminOwnerRequestsPage() {
  const requests = await getOwnerRequestsAction();

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Container>
        <PageHeader
          title="Owner Requests"
          description="Review and approve property owner applications"
        />
        <AdminOwnerRequestList requests={requests} />
      </Container>
    </div>
  );
}