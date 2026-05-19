import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: "user";
    };
  }

  interface User {
    role: "user";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "user";
  }
}
