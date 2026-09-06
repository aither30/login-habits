import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const { email, password } = body;

  // Dummy account
  const validEmail = "admin@gmail.com";
  const validPassword = "12345678";

  if (email !== validEmail || password !== validPassword) {
    return NextResponse.json(
      {
        message: "Email atau password salah",
      },
      {
        status: 401,
      }
    );
  }

  const response = NextResponse.json({
    message: "Login berhasil",
  });

  response.cookies.set("session", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}