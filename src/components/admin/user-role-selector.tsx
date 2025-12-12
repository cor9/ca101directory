"use client";

import { type UserRole, updateUserRole } from "@/actions/admin-users";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface UserRoleSelectorProps {
  userId: string;
  currentRole: UserRole;
  userEmail: string;
  isCurrentUser?: boolean;
}

const ROLE_OPTIONS: { value: UserRole; label: string; description: string }[] =
  [
    {
      value: "guest",
      label: "Guest",
      description: "Can browse the directory",
    },
    {
      value: "parent",
      label: "Parent",
      description: "Can browse and leave reviews",
    },
    {
      value: "vendor",
      label: "Vendor",
      description: "Can manage their own listings",
    },
    {
      value: "admin",
      label: "Admin",
      description: "Full access to all features",
    },
  ];

export function UserRoleSelector({
  userId,
  currentRole,
  userEmail,
  isCurrentUser = false,
}: UserRoleSelectorProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);

  const handleRoleChange = (newRole: UserRole) => {
    if (isCurrentUser) {
      toast.error("You cannot change your own role");
      return;
    }

    startTransition(async () => {
      const result = await updateUserRole(userId, newRole);

      if (result.status === "success") {
        setSelectedRole(newRole);
        toast.success(result.message);
      } else {
        toast.error(result.message);
        // Reset to current role on error
        setSelectedRole(currentRole);
      }
    });
  };

  if (isCurrentUser) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium capitalize text-muted-foreground">
          {currentRole}
        </span>
        <span className="text-xs text-muted-foreground">(You)</span>
      </div>
    );
  }

  return (
    <Select
      value={selectedRole}
      onValueChange={handleRoleChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue>
          <span className="capitalize">{selectedRole}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {ROLE_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <div className="flex flex-col">
              <span className="font-medium">{option.label}</span>
              <span className="text-xs text-muted-foreground">
                {option.description}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
