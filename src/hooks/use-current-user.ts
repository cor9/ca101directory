import { useSession } from "next-auth/react";

// TODO(javayhu): 这个hook在server action中不能用?
// TODO(javayhu): 为什么有2个currentUser?还有个currentUser()在lib/auth.ts中
export const useCurrentUser = () => {
  const session = useSession();
  return session.data?.user;
};