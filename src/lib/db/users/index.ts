import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import type { AppUser, UserRole } from "@/lib/db/types";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_ROLE: UserRole = "user";

type UserRow = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: string;
};

function mapUserRow(row: UserRow): AppUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role,
    createdAt: row.created_at,
  };
}

export async function leerUsuarios(): Promise<AppUser[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("id,name,email,password_hash,role,created_at")
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

export async function crearUsuario(input: {
  name: string;
  email: string;
  password: string;
}): Promise<Omit<AppUser, "passwordHash">> {
  const normalizedEmail = input.email.trim().toLowerCase();

  const supabase = await createClient();

  const passwordHash = await bcrypt.hash(input.password, 10);
  const newUser: AppUser = {
    id: randomUUID(),
    name: input.name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: DEFAULT_ROLE,
    createdAt: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("users")
    .insert({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      password_hash: newUser.passwordHash,
      role: newUser.role,
      created_at: newUser.createdAt,
    })
    .select("id,name,email,role,created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("EMAIL_IN_USE");
    }

    throw new Error(`crearUsuario: ${error.message}`);
  }

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role,
    createdAt: data.created_at,
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
  if (!user) return null;

  const mappedUser = mapUserRow(user as UserRow);
  const safeUser = { ...mappedUser };
  delete safeUser.passwordHash;
  return safeUser;
}
