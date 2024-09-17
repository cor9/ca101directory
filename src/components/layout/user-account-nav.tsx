"use client";

import { UserAvatar } from "@/components/shared/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMediaQuery } from "@/hooks/use-media-query";
import { LayoutDashboard, LogOut, LogOutIcon, Settings, UploadIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Drawer } from "vaul";
import { Icons } from "@/components/shared/icons";
import { LogoutButton } from "../auth/logout-button";
import { currentUser } from "@/lib/auth";
import { useCurrentUser } from "@/hooks/use-current-user";

export function UserAccountNav() {
  // 只有使用这种方式，用户退出时navbar的表现是正常的！
  // const { data: session } = useSession();
  // const user = session?.user;

  // 使用这个会报错
  // const user = currentUser();

  // 这个可能导致navbar上没有退出 
  // => 非也，其实上面的逻辑跟useCurrentUser方法的逻辑是一样的，所以其实改成这种形式也正常
  // 难道是因为重启了Chrome恢复了？
  // https://github.com/javayhu/Authy/blob/main/components/auth/user-button.tsx
  const user = useCurrentUser();

  const [open, setOpen] = useState(false);
  const closeDrawer = () => {
    setOpen(false);
  };

  const { isMobile } = useMediaQuery();

  if (!user) {
    return (
      <div className="size-8 animate-pulse rounded-full border bg-muted" />
    );
  }

  // Mobile View, use Drawer
  if (isMobile) {
    return (
      <Drawer.Root open={open} onClose={closeDrawer}>
        <Drawer.Trigger onClick={() => setOpen(true)}>
          <UserAvatar
            user={{ name: user.name || null, image: user.image || null }}
            className="size-8 border"
          />
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay
            className="fixed inset-0 z-40 h-full bg-background/80 backdrop-blur-sm"
            onClick={closeDrawer}
          />
          <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 mt-24 overflow-hidden rounded-t-[10px] border bg-background px-3 text-sm">
            <div className="sticky top-0 z-20 flex w-full items-center justify-center bg-inherit">
              <div className="my-3 h-1.5 w-16 rounded-full bg-muted-foreground/20" />
            </div>

            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col">
                {user.name && <p className="font-medium">{user.name}</p>}
                {user.email && (
                  <p className="w-[200px] truncate text-muted-foreground">
                    {user?.email}
                  </p>
                )}
              </div>
            </div>

            <ul role="list" className="mb-14 mt-1 w-full text-muted-foreground">
              {/* {user.role === "ADMIN" ? (
                <li className="rounded-lg text-foreground hover:bg-muted">
                  <Link
                    href="/admin"
                    onClick={closeDrawer}
                    className="flex w-full items-center gap-3 px-2.5 py-2"
                  >
                    <Lock className="size-4" />
                    <p className="text-sm">Admin</p>
                  </Link>
                </li>
              ) : null} */}

              <li className="rounded-lg text-foreground hover:bg-muted">
                <Link
                  href="/dashboard"
                  onClick={closeDrawer}
                  className="flex w-full items-center gap-3 px-2.5 py-2"
                >
                  <LayoutDashboard className="size-4" />
                  <p className="text-sm">Dashboard</p>
                </Link>
              </li>

              <li className="rounded-lg text-foreground hover:bg-muted">
                <Link
                  href="/submit"
                  onClick={closeDrawer}
                  className="flex w-full items-center gap-3 px-2.5 py-2"
                >
                  <Icons.submit className="size-4" />
                  <p className="text-sm">Submit</p>
                </Link>
              </li>

              <li
                className="rounded-lg text-foreground hover:bg-muted"
                onClick={(event) => {
                  event.preventDefault();
                  signOut({
                    callbackUrl: `${window.location.origin}/`,
                  });
                }}
              >
                <div className="flex w-full items-center gap-3 px-2.5 py-2">
                  <LogOut className="size-4" />
                  <p className="text-sm">Log out</p>
                </div>
              </li>
            </ul>
          </Drawer.Content>
          <Drawer.Overlay />
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  // Desktop View, use DropdownMenu
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        <UserAvatar
          user={{ name: user.name || null, image: user.image || null }}
          className="size-8 border"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name && (
              <p className="font-medium">
                {user.name}
              </p>
            )}
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user?.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />

        {/* {user.role === "ADMIN" ? (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="flex items-center space-x-2.5">
              <Lock className="size-4" />
              <p className="text-sm">Admin</p>
            </Link>
          </DropdownMenuItem>
        ) : null} */}

        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex items-center space-x-2.5">
            <LayoutDashboard className="size-4" />
            <p className="text-sm">Dashboard</p>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/submit"
            className="flex items-center space-x-2.5"
          >
            <UploadIcon className="size-4" />
            <p className="text-sm">Submit</p>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* 这里使用LogoutButton后，点击退出，确实退出了，但是navbar还是显示用户头像，重新刷新下才好了 */}
        {/* <DropdownMenuItem asChild >
          <div className="flex items-center space-x-2.5 cursor-pointer">
            <LogOut className="size-4" />
            <LogoutButton >
              <p className="text-sm">Log out</p>
            </LogoutButton>
          </div>
        </DropdownMenuItem> */}

        {/* 参考authy的代码，改成这样的形式也不对，navbar上用户头像还在 */}
        {/* https://github.com/javayhu/Authy/blob/main/components/auth/user-button.tsx#L34 */}
        {/* <LogoutButton>
          <DropdownMenuItem>
            <LogOutIcon className="h-4 w-4 mr-2" />
            <span>Log out</span>
          </DropdownMenuItem>
        </LogoutButton> */}

        {/* TODO(javayhu): 之前这里还好好的，现在点击退出，确实退出了，但是navbar还是显示用户头像，重新刷新下才好 */}
        {/* 加了redirect: true后，还是有这个问题 */}
        {/* https://next-auth.js.org/getting-started/client#using-the-redirect-false-option-1 */}
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault();
            signOut({
              callbackUrl: `${window.location.origin}/`,
              redirect: true,
            });
          }}
        >
          <div className="flex items-center space-x-2.5">
            <LogOut className="size-4" />
            <p className="text-sm">Log out</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
