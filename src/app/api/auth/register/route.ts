import { NextResponse } from "next/server";
import { crearUsuario } from "@/lib/db/users";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
    };

    if (!body.name || !body.email || !body.password) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 },
      );
    }

    if (body.password.length < 6) {
      return NextResponse.json(
        { error: "La contrasena debe tener al menos 6 caracteres" },
        { status: 400 },
      );
    }

    const user = await crearUsuario({
      name: body.name,
      email: body.email,
      password: body.password,
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_IN_USE") {
      return NextResponse.json(
        { error: "Ya existe un usuario con ese email" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "No se pudo crear el usuario" },
      { status: 500 },
    );
  }
}
