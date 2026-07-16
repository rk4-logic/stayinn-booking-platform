"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils/formatDate";
import { ROLE_COLORS } from "@/lib/constants/status";
import { updateUserRoleAction } from "@/actions/user.actions";
import { UserRole, type IUser } from "@/types/user.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AdminUser = Pick<
  IUser,
  | "_id"
  | "firstName"
  | "lastName"
  | "email"
  | "role"
  | "imageUrl"
  | "createdAt"
>;

interface AdminUserListProps {
  users: AdminUser[];
}

export default function AdminUserList({ users }: AdminUserListProps) {

  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setLoadingId(userId);

    const result = await updateUserRoleAction(userId, newRole);

    if (result.success) {
      toast.success("User role updated");
      router.refresh();
    } else {
      toast.error(String(result.error) || "Failed to update role");
    }

    setLoadingId(null);
  };

  if (!users || users.length === 0) {
    return (
      <div className="bg-white rounded-xl border p-8 text-center text-gray-400">
        No users found.
      </div>
    );
  }

  return (

    <div className="bg-white rounded-xl border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="text-left p-4 text-gray-600 font-medium">User</th>
            <th className="text-left p-4 text-gray-600 font-medium">Email</th>
            <th className="text-left p-4 text-gray-600 font-medium">Role</th>
            <th className="text-left p-4 text-gray-600 font-medium">Joined</th>
            <th className="text-left p-4 text-gray-600 font-medium">
              Change Role
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {users.map((user) => {
            const userId = String(user._id);
            return (
              <tr key={userId} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {user.imageUrl ? (
                      <Image
                        src={user.imageUrl}
                        alt={user.firstName ?? "User"}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-xs">
                        {user.firstName?.[0] ?? "U"}
                      </div>
                    )}
                    <span className="font-medium text-gray-900">
                      {user.firstName ?? ""} {user.lastName ?? ""}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-gray-500">{user.email}</td>
                <td className="p-4">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${ROLE_COLORS[user.role] ?? ROLE_COLORS.customer
                      }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-gray-500">
                  {formatDate(user.createdAt)}
                </td>
                <td className="p-4">
                  <Select
                    defaultValue={user.role}
                    disabled={
                      loadingId === userId || user.role === UserRole.ADMIN
                    }
                    onValueChange={(value) =>
                      handleRoleChange(userId, value as UserRole)
                    }
                  >
                    <SelectTrigger className="w-32 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UserRole.CUSTOMER}>
                        Customer
                      </SelectItem>
                      <SelectItem value={UserRole.OWNER}>Owner</SelectItem>
                      <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}