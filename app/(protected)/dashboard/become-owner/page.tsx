import { getAuthenticatedUser } from "@/actions/user.actions";
import { getUserOwnerRequestAction } from "@/actions/owner-request.actions";
import Container from "@/components/shared/Container";
import BecomeOwnerForm from "@/components/owner/BecomeOwnerForm";
import { redirect } from "next/navigation";
import { UserRole } from "@/types/user.types";
import { Building2, Clock, CheckCircle, XCircle } from "lucide-react";
import { OwnerRequestStatus } from "@/lib/constants/status";

export const metadata = {
  title: "Become an Owner — StayInn",
};

export default async function BecomeOwnerPage() {
  const user = await getAuthenticatedUser().catch(() => null);
  if (!user) redirect("/sign-in");

  // already an owner
  if (user.role === UserRole.OWNER) redirect("/owner/properties");
  if (user.role === UserRole.ADMIN) redirect("/admin");

  const existingRequest = await getUserOwnerRequestAction();

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <Container>
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Become a Property Owner
            </h1>
            <p className="text-gray-500">
              List your property and reach thousands of travelers worldwide.
            </p>
          </div>

          {/* Status — if request already submitted */}
          {existingRequest && (
            <div
              className={`rounded-xl border p-5 flex items-start gap-4 ${
                existingRequest.status === OwnerRequestStatus.PENDING
                  ? "bg-yellow-50 border-yellow-200"
                  : existingRequest.status === OwnerRequestStatus.APPROVED
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              {existingRequest.status === OwnerRequestStatus.PENDING && (
                <Clock className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
              )}
              {existingRequest.status === OwnerRequestStatus.APPROVED && (
                <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              )}
              {existingRequest.status === OwnerRequestStatus.REJECTED && (
                <XCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-semibold text-gray-900 capitalize">
                  Request {existingRequest.status}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {existingRequest.status === OwnerRequestStatus.PENDING &&
                    "Your request is under review. We'll notify you soon."}
                  {existingRequest.status === OwnerRequestStatus.APPROVED &&
                    "Your request was approved! You can now list properties."}
                  {existingRequest.status === OwnerRequestStatus.REJECTED &&
                    "Your request was rejected. You can submit a new request below."}
                </p>
              </div>
            </div>
          )}

          {/* Show form if no pending request */}
          {(!existingRequest ||
            existingRequest.status === OwnerRequestStatus.REJECTED) && (
            <BecomeOwnerForm />
          )}
        </div>
      </Container>
    </div>
  );
}