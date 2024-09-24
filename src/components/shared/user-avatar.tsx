import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types/next-auth";
import { AvatarProps } from "@radix-ui/react-avatar";
import { UserIcon } from "lucide-react";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "image" | "name">
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {user.image ? (
        <AvatarImage alt="user avatar" src={user.image} referrerPolicy="no-referrer" />
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user.name}</span>
          <UserIcon className="size-4" />
        </AvatarFallback>
      )}
    </Avatar>
  )
}
