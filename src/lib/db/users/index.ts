import type { AppUser, UserRole } from "@/lib/db/types";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type UserRow = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
};

function mapUserRow(row: UserRow): AppUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    avatarUrl: row.avatar_url,
    role: row.role,
    createdAt: row.created_at,
  };
}

export async function leerUsuarios(): Promise<AppUser[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("users")
    .select("id,name,email,password_hash,avatar_url,role,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`leerUsuarios: ${error.message}`);
  }

  return (data ?? []).map((row) => mapUserRow(row as UserRow));
}

export async function leerUsuarioPorEmail(email: string): Promise<AppUser | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const users = await leerUsuarios();

  return users.find((user) => user.email.toLowerCase() === normalizedEmail) ?? null;
}

export async function leerUsuarioPorId(id: string): Promise<AppUser | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("users")
    .select("id,name,email,password_hash,avatar_url,role,created_at")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }

    throw new Error(`leerUsuarioPorId: ${error.message}`);
  }

  return mapUserRow(data as UserRow);
}

export async function crearUsuario(input: {
  name: string;
  email: string;
  password: string;
}): Promise<Omit<AppUser, "passwordHash">> {
  const normalizedEmail = input.email.trim().toLowerCase();

  const supabase = await createClient();

  const { data, error } = await supabase.rpc("create_user", {
    p_name: input.name.trim(),
    p_email: normalizedEmail,
    p_password: input.password,
  });

  if (error) {
    if (error.code === "23505") {
      throw new Error("EMAIL_IN_USE");
    }

    throw new Error(`crearUsuario: ${error.message}`);
  }

  const insertedUser = Array.isArray(data) ? data[0] : data;
  if (!insertedUser) {
    throw new Error("crearUsuario: no se pudo crear el usuario");
  }

  const mappedUser = mapUserRow(insertedUser as UserRow);

  return {
    id: mappedUser.id,
    name: mappedUser.name,
    email: mappedUser.email,
    avatarUrl: mappedUser.avatarUrl,
    role: mappedUser.role,
    createdAt: mappedUser.createdAt,
  };
}

export async function validarCredenciales(input: {
  email: string;
  password: string;
}): Promise<Omit<AppUser, "passwordHash"> | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("authenticate_user", {
    p_email: input.email,
    p_password: input.password,
  });

  if (error) {
    throw new Error(`validarCredenciales: ${error.message}`);
  }

  const user = Array.isArray(data) ? data[0] : data;
  if (!user) {
    return null;
  }

  const mappedUser = mapUserRow(user as UserRow);
  return {
    id: mappedUser.id,
    name: mappedUser.name,
    email: mappedUser.email,
    avatarUrl: mappedUser.avatarUrl,
    role: mappedUser.role,
    createdAt: mappedUser.createdAt,
  };
}
