import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

const validGoalTypes = [
  "COUNT",
  "SAVINGS",
  "DISTANCE",
  "DURATION",
] as const;

type GoalType =
  (typeof validGoalTypes)[number];

function isValidGoalType(
  value: unknown
): value is GoalType {
  return (
    typeof value === "string" &&
    validGoalTypes.includes(
      value as GoalType
    )
  );
}

/*
 * UPDATE GOAL
 *
 * Bisa digunakan untuk:
 * - Update progress
 * - Edit title
 * - Edit description
 * - Edit type
 * - Edit target
 * - Edit unit
 * - Edit deadline
 */
export async function PATCH(
  request: Request,
  context: Context
) {
  try {
    const session =
      await getServerSession(
        authOptions
      );

    const userId =
      session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { id } =
      await context.params;

    const existingGoal =
      await prisma.goal.findFirst({
        where: {
          id,
          userId,
        },
      });

    if (!existingGoal) {
      return NextResponse.json(
        {
          error: "Goal not found",
        },
        {
          status: 404,
        }
      );
    }

    const body =
      await request.json();

    /*
     * --------------------------------
     * CURRENT VALUES
     * --------------------------------
     *
     * Kalau field tidak dikirim,
     * gunakan nilai yang sudah ada.
     */
    let title =
      existingGoal.title;

    let description =
      existingGoal.description;

    let type =
      existingGoal.type;

    let target =
      existingGoal.target;

    let progress =
      existingGoal.progress;

    let unit =
      existingGoal.unit;

    let deadline =
      existingGoal.deadline;

    /*
     * --------------------------------
     * TITLE
     * --------------------------------
     */
    if (
      body.title !== undefined
    ) {
      if (
        typeof body.title !==
          "string" ||
        !body.title.trim()
      ) {
        return NextResponse.json(
          {
            error:
              "Goal title is required",
          },
          {
            status: 400,
          }
        );
      }

      title =
        body.title.trim();
    }

    /*
     * --------------------------------
     * DESCRIPTION
     * --------------------------------
     */
    if (
      body.description !==
      undefined
    ) {
      if (
        body.description ===
        null
      ) {
        description = null;
      } else if (
        typeof body.description ===
        "string"
      ) {
        description =
          body.description.trim() ||
          null;
      }
    }

    /*
     * --------------------------------
     * TYPE
     * --------------------------------
     */
    if (
      body.type !== undefined
    ) {
      if (
        !isValidGoalType(
          body.type
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid goal type",
          },
          {
            status: 400,
          }
        );
      }

      type = body.type;
    }

    /*
     * --------------------------------
     * TARGET
     * --------------------------------
     */
    if (
      body.target !== undefined
    ) {
      const numericTarget =
        Number(body.target);

      if (
        !Number.isFinite(
          numericTarget
        ) ||
        numericTarget <= 0
      ) {
        return NextResponse.json(
          {
            error:
              "Target must be greater than 0",
          },
          {
            status: 400,
          }
        );
      }

      target =
        Math.round(
          numericTarget
        );
    }

    /*
     * --------------------------------
     * PROGRESS
     * --------------------------------
     */
    if (
      body.progress !== undefined
    ) {
      const numericProgress =
        Number(body.progress);

      if (
        !Number.isFinite(
          numericProgress
        ) ||
        numericProgress < 0
      ) {
        return NextResponse.json(
          {
            error:
              "Progress must be 0 or greater",
          },
          {
            status: 400,
          }
        );
      }

      progress =
        Math.min(
          target,
          Math.round(
            numericProgress
          )
        );
    }

    /*
     * --------------------------------
     * UNIT
     * --------------------------------
     */
    if (
      body.unit !== undefined
    ) {
      if (
        body.unit === null
      ) {
        unit = null;
      } else if (
        typeof body.unit ===
        "string"
      ) {
        unit =
          body.unit.trim() ||
          null;
      }
    }

    /*
     * --------------------------------
     * AUTO UNIT
     * --------------------------------
     *
     * Supaya unit tidak salah ketika
     * user mengganti tipe Goal.
     */
    if (
      body.type !== undefined &&
      body.unit === undefined
    ) {
      switch (type) {
        case "SAVINGS":
          unit = null;
          break;

        case "DISTANCE":
          unit = "km";
          break;

        case "DURATION":
          unit = "hours";
          break;

        case "COUNT":
          unit = "times";
          break;
      }
    }

    /*
     * --------------------------------
     * DEADLINE
     * --------------------------------
     */
    if (
      body.deadline !==
      undefined
    ) {
      if (
        body.deadline === null ||
        body.deadline === ""
      ) {
        deadline = null;
      } else {
        const parsedDeadline =
          new Date(
            body.deadline
          );

        if (
          Number.isNaN(
            parsedDeadline.getTime()
          )
        ) {
          return NextResponse.json(
            {
              error:
                "Invalid deadline",
            },
            {
              status: 400,
            }
          );
        }

        deadline =
          parsedDeadline;
      }
    }

    /*
     * --------------------------------
     * COMPLETED
     * --------------------------------
     */
    const completed =
      progress >= target;

    /*
     * --------------------------------
     * UPDATE DATABASE
     * --------------------------------
     */
    const goal =
      await prisma.goal.update({
        where: {
          id,
        },
        data: {
          title,
          description,
          type,
          target,
          progress,
          unit,
          deadline,
          completed,
        },
      });

    return NextResponse.json(
      goal
    );
  } catch (error) {
    console.error(
      "Failed to update goal:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to update goal",
      },
      {
        status: 500,
      }
    );
  }
}

/*
 * DELETE GOAL
 */
export async function DELETE(
  request: Request,
  context: Context
) {
  try {
    const session =
      await getServerSession(
        authOptions
      );

    const userId =
      session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { id } =
      await context.params;

    const existingGoal =
      await prisma.goal.findFirst({
        where: {
          id,
          userId,
        },
      });

    if (!existingGoal) {
      return NextResponse.json(
        {
          error:
            "Goal not found",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.goal.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Failed to delete goal:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to delete goal",
      },
      {
        status: 500,
      }
    );
  }
}