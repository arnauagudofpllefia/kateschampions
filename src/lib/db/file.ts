import { promises as fs } from "node:fs";
import path from "node:path";
import databaseJson from "@/data/database.json";
import type { DatabaseSchema } from "./types";

const DB_PATH = path.join(process.cwd(), "src", "data", "database.json");

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export async function leerDB(): Promise<DatabaseSchema> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(raw) as DatabaseSchema;
  } catch {
    return clone(databaseJson as DatabaseSchema);
  }
}

export async function guardarDB(data: DatabaseSchema): Promise<void> {
  const serialized = JSON.stringify(data, null, 2);
  await fs.writeFile(DB_PATH, `${serialized}\n`, "utf-8");
}
