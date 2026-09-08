import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan." },
        { status: 404 }
      );
    }

    const notes = await prisma.note.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("GET NOTES ERROR:", error);

    return NextResponse.json(
      { error: "Gagal mengambil notes." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User tidak ditemukan." },
        { status: 404 }
      );
    }

    const body = await request.json();

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const content =
      typeof body.content === "string"
        ? body.content.trim()
        : "";

    if (!title) {
      return NextResponse.json(
        { error: "Judul note wajib diisi." },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        { error: "Isi note wajib diisi." },
        { status: 400 }
      );
    }

    const note = await prisma.note.create({
      data: {
        userId: user.id,
        title,
        content,
      },
    });

    return NextResponse.json(note, {
      status: 201,
    });
  } catch (error) {
    console.error("CREATE NOTE ERROR:", error);

    return NextResponse.json(
      { error: "Gagal membuat note." },
      { status: 500 }
    );
  }
}