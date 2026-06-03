import type { DefaultSession } from "next-auth";

type AppRole = "user" | "editor" | "admin";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: AppRole;
      avatarUrl?: string | null;
    };
  }

  interface User {
    role: AppRole;
    avatarUrl?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: AppRole;
    avatarUrl?: string | null;
  }
}
