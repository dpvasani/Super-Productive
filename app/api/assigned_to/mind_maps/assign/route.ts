import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NotifyType } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request) {
  const session = await getAuthSession();

  if (!session?.user) {
    return new Response("Unauthorized", {
      status: 400,
      statusText: "Unauthorized User",
    });
  }

  const assignToMindMapSchema = z.object({
    workspaceId: z.string(),
    mindMapId: z.string(),
    assignToUserId: z.string(),
  });

  const body: unknown = await request.json();

  const result = assignToMindMapSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json("ERRORS.WRONG_DATA", { status: 401 });
  }

  const { workspaceId, mindMapId, assignToUserId } = result.data;

  try {
    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      include: {
        subscriptions: {
          where: {
            workspaceId: workspaceId,
          },
          select: {
            userRole: true,
          },
        },
      },
    });

    if (!user) {
      return new NextResponse("User not found", {
        status: 404,
        statusText: "User not Found",
      });
    }

    if (user.subscriptions[0].userRole === "READ_ONLY") {
      return NextResponse.json("ERRORS.NO_PERMISSION", { status: 403 });
    }

    const assigningUser = await db.user.findUnique({
      where: {
        id: assignToUserId,
      },
      include: {
        assignedToMindMap: {
          where: {
            mindMapId,
          },
        },
      },
    });

    if (!assigningUser)
      return NextResponse.json("ERROR.USER_NO_EXIST", { status: 405 });

    if (
      !assigningUser?.assignedToMindMap ||
      assigningUser?.assignedToMindMap.length === 0
    ) {
      await db.assignedToMindMap.create({
        data: {
          userId: assignToUserId,
          mindMapId,
        },
      });

      if (assignToUserId !== session.user.id) {
        await db.notification.create({
          data: {
            notifyCreatorId: session.user.id,
            userId: assignToUserId,
            notifyType: NotifyType.NEW_ASSIGNMENT_MIND_MAP,
            workspaceId,
            mindMapId,
          },
        });
      }
      return NextResponse.json("OK", { status: 200 });
    } else {
      await db.assignedToMindMap.delete({
        where: {
          id: assigningUser.assignedToMindMap[0].id,
        },
      });

      if (assigningUser.assignedToMindMap[0].id !== session.user.id) {
        await db.notification.deleteMany({
          where: {
            notifyCreatorId: session.user.id,
            userId: assignToUserId,
            notifyType: NotifyType.NEW_ASSIGNMENT_TASK,
            workspaceId,
            mindMapId,
          },
        });
      }

      return NextResponse.json("OK", { status: 200 });
    }
  } catch (_) {
    return NextResponse.json("ERRORS.DB_ERROR", { status: 405 });
  }
}
