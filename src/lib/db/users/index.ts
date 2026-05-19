import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import type { AppUser, UserRole } from "@/lib/db/types";
import { guardarDB, leerDB } from "../file";

const DEFAULT_ROLE: UserRole = "user";

export async function leerUsuarios(): Promise<AppUser[]> {
  const db = await leerDB();
  return db.users;
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
  const db = await leerDB();
  const normalizedEmail = input.email.trim().toLowerCase();

  const alreadyExists = db.users.some(
    (user) => user.email.toLowerCase() === normalizedEmail,
  );

  if (alreadyExists) {
    throw new Error("EMAIL_IN_USE");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const newUser: AppUser = {
    id: randomUUID(),
    name: input.name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: DEFAULT_ROLE,
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  await guardarDB(db);

  const safeUser = { ...newUser };
  delete safeUser.passwordHash;
  return safeUser;
}

export async function validarCredenciales(input: {
  email: string;
  password: string;
}): Promise<Omit<AppUser, "passwordHash"> | null> {
  const user = await leerUsuarioPorEmail(input.email);
  if (!user) return null;

  const isValid = await bcrypt.compare(input.password, user.passwordHash);
  if (!isValid) return null;

  const safeUser = { ...user };
  delete safeUser.passwordHash;
  return safeUser;
}
