import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session =
      await getServerSession(authOptions);

    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const goals = await prisma.goal.findMany({
      where: {
        userId,
      },
      orderBy: [
        {
          completed: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

    return NextResponse.json(goals);
  } catch (error) {
    console.error(
      "GET /api/goals error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to fetch goals" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const session =
      await getServerSession(authOptions);

    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const description =
      typeof body.description ===
      "string"
        ? body.description.trim()
        : null;

    const target =
      Number.isFinite(
        Number(body.target)
      )
        ? Math.max(
            1,
            Math.round(
              Number(body.target)
            )
          )
        : 100;

    const deadline =
      body.deadline
        ? new Date(body.deadline)
        : null;

    if (!title) {
      return NextResponse.json(
        {
          error:
            "Goal title is required",
        },
        { status: 400 }
      );
    }

    const goal = await prisma.goal.create({
      data: {
        userId,
        title,
        description:
          description || null,
        target,
        progress: 0,
        deadline:
          deadline &&
          !Number.isNaN(
            deadline.getTime()
          )
            ? deadline
            : null,
        completed: false,
      },
    });

    return NextResponse.json(goal, {
      status: 201,
    });
  } catch (error) {
    console.error(
      "POST /api/goals error:",
      error
    );

    return NextResponse.json(
      { error: "Failed to create goal" },
      { status: 500 }
    );
  }
}