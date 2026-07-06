import Container from "@/components/shared/Container";
import PageHeader from "@/components/shared/PageHeader";
import AdminUserList from "@/components/admin/AdminUserList";
import { getUsersAction } from "@/actions/user.actions";

export const metadata = {
  title: "Admin — Users — StayInn",
};

export default async function AdminUsersPage() {
  const users = await getUsersAction();

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <Container>
        <PageHeader
          title="Manage Users"
          description="View and manage all platform users"
        />
        <AdminUserList users={users} />
      </Container>
    </div>
  );
}