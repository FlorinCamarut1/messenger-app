import { getCurrentUser } from "@/actions/getCurrentUser";

import db from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

interface IParams {
  conversationId?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser();
    const { conversationId } = params;

    if (!currentUser?.id || !currentUser?.email) {
      return Response.json("Unauthorized", { status: 401 });
    }

    const conversation = await db.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          include: {
            seen: true,
          },
        },
        users: true,
      },
    });

    if (!conversation) return Response.json("Invalid ID", { status: 400 });

    const lastMessage = conversation.messages[conversation.messages.length - 1];

    if (!lastMessage) return Response.json(conversation);

    const updatedMessage = await db.message.update({
      where: {
        id: lastMessage.id,
      },
      include: {
        sender: true,
        seen: true,
      },
      data: {
        seen: {
          connect: {
            id: currentUser?.id,
          },
        },
      },
    });

    await pusherServer.trigger(currentUser.email, "conversation:update", {
      id: conversationId,
      messages: [updatedMessage],
    });

    if (lastMessage.senderId.indexOf(currentUser.id) !== -1) {
      return NextResponse.json(conversation);
    }

    await pusherServer.trigger(
      conversationId!,
      "message:update",
      updatedMessage,
    );

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal error!" }, { status: 500 });
  }
}
