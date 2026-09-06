import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/*
 * PUT
 * Update habit.
 */
export async function PUT(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

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

    const existingHabit =
      await prisma.habit.findFirst({
        where: {
          id,
          userId: user.id,
        },
      });

    if (!existingHabit) {
      return NextResponse.json(
        { error: "Habit not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const habit = await prisma.habit.update({
      where: {
        id,
      },
      data: {
        name:
          body.name !== undefined
            ? body.name.trim()
            : undefined,

        description:
          body.description !== undefined
            ? body.description?.trim() || null
            : undefined,

        emoji:
          body.emoji !== undefined
            ? body.emoji
            : undefined,

        color:
          body.color !== undefined
            ? body.color
            : undefined,

        time:
          body.time !== undefined
            ? body.time
            : undefined,

        frequency:
          body.frequency !== undefined
            ? body.frequency
            : undefined,

        active:
          body.active !== undefined
            ? body.active
            : undefined,
      },
    });

    return NextResponse.json(habit);
  } catch (error) {
    console.error("PUT /api/habits/[id] error:", error);

    return NextResponse.json(
      { error: "Failed to update habit" },
      { status: 500 }
    );
  }
}

/*
 * DELETE
 * Hapus habit.
 */
export async function DELETE(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

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

    const existingHabit =
      await prisma.habit.findFirst({
        where: {
          id,
          userId: user.id,
        },
      });

    if (!existingHabit) {
      return NextResponse.json(
        { error: "Habit not found" },
        { status: 404 }
      );
    }

    await prisma.habit.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "DELETE /api/habits/[id] error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to delete habit" },
      { status: 500 }
    );
  }
}