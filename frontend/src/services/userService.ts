// accountMenu.ts
import { User, LogOut, Settings } from "lucide-react";

export interface AccountMenuItem {
  label: string;
  icon: React.ElementType;
  action: "navigate" | "logout";
  path?: string;
}

export const accountMenuItems: AccountMenuItem[] = [
  {
    label: "Profile",
    icon: User,
    action: "navigate",
    path: "/users/profile",
  },
  {
    label: "Settings",
    icon: Settings,
    action: "navigate",
    path: "/user/settings",
  },
];
