import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/*
 * GET
 * Mengambil semua habit milik user yang sedang login.
 */
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
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const habits = await prisma.habit.findMany({
      where: {
        userId: user.id,
      },
      include: {
        completions: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(habits);
  } catch (error) {
    console.error("GET /api/habits error:", error);

    return NextResponse.json(
      { error: "Failed to fetch habits" },
      { status: 500 }
    );
  }
}

/*
 * POST
 * Membuat habit baru untuk user yang sedang login.
 */
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
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const {
      name,
      description,
      emoji,
      color,
      time,
      frequency,
    } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Habit name is required" },
        { status: 400 }
      );
    }

    const habit = await prisma.habit.create({
      data: {
        userId: user.id,
        name: name.trim(),
        description:
          description?.trim() || null,
        emoji: emoji || "✅",
        color: color || null,
        time: time || null,
        frequency: frequency || "daily",
      },
    });

    return NextResponse.json(habit, {
      status: 201,
    });
  } catch (error) {
    console.error("POST /api/habits error:", error);

    return NextResponse.json(
      { error: "Failed to create habit" },
      { status: 500 }
    );
  }
}