import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function getToday() {
  const now = new Date();

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
}

export async function POST(
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

    const habit = await prisma.habit.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!habit) {
      return NextResponse.json(
        { error: "Habit not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    const completed = Boolean(body.completed);

    const date = getToday();

    if (completed) {
      const completion =
        await prisma.habitCompletion.upsert({
          where: {
            habitId_date: {
              habitId: id,
              date,
            },
          },
          update: {
            completed: true,
          },
          create: {
            habitId: id,
            date,
            completed: true,
          },
        });

      return NextResponse.json(completion);
    }

    await prisma.habitCompletion.deleteMany({
      where: {
        habitId: id,
        date,
      },
    });

    return NextResponse.json({
      success: true,
      completed: false,
    });
  } catch (error) {
    console.error(
      "POST /api/habits/[id]/completion error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to update completion" },
      { status: 500 }
    );
  }
}