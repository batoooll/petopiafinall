import prisma from "@/config/prisma";
import { AppError, HttpCode } from "@/common/errors/AppError";
import type { Prisma } from "../../../generated/prisma";
import {
  MatchRequestStatus,
  SittingBookingStatus,
} from "../../../generated/prisma";

export const chatMessagePublicInclude = {
  sender: {
    select: {
      id: true,
      fullName: true,
    },
  },
  asset: {
    select: {
      id: true,
      url: true,
      mimeType: true,
      sizeBytes: true,
    },
  },
} satisfies Prisma.ChatMessageInclude;

export type ChatMessageWithPublicRelations = Prisma.ChatMessageGetPayload<{
  include: typeof chatMessagePublicInclude;
}>;

export const conversationWithParticipantsInclude = {
  participants: {
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
  },
} satisfies Prisma.ConversationInclude;

export type ConversationWithParticipants = Prisma.ConversationGetPayload<{
  include: typeof conversationWithParticipantsInclude;
}>;

export class ChatRepository {
  /** Creates a 1:1 conversation or returns the existing one (used after match / booking accept). */
  static async createConversationIfMissing(
    userA: string,
    userB: string,
    db: Prisma.TransactionClient | typeof prisma = prisma
  ) {
    if (userA === userB) {
      throw new AppError(
        "Invalid conversation participants",
        HttpCode.BAD_REQUEST
      );
    }

    const existingConversation = await db.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId: userA } } },
          { participants: { some: { userId: userB } } },
        ],
      },
    });

    if (existingConversation) {
      return existingConversation;
    }

    return db.conversation.create({
      data: {
        participants: {
          create: [{ userId: userA }, { userId: userB }],
        },
      },
    });
  }

  static async hasActiveChatLink(
    userId: string,
    peerId: string,
    db: Prisma.TransactionClient | typeof prisma = prisma
  ): Promise<boolean> {
    if (userId === peerId) {
      return false;
    }

    const acceptedMatch = await db.petMatchRequest.findFirst({
      where: {
        status: MatchRequestStatus.ACCEPTED,
        OR: [
          {
            fromPet: { ownerId: userId },
            toPet: { ownerId: peerId },
          },
          {
            fromPet: { ownerId: peerId },
            toPet: { ownerId: userId },
          },
        ],
      },
      select: { id: true },
    });

    if (acceptedMatch) {
      return true;
    }

    const booking = await db.sittingBooking.findFirst({
      where: {
        status: {
          in: [SittingBookingStatus.ACCEPTED, SittingBookingStatus.COMPLETED],
        },
        OR: [
          { sitterId: userId, petOwnerId: peerId },
          { sitterId: peerId, petOwnerId: userId },
        ],
      },
      select: { id: true },
    });

    return Boolean(booking);
  }

  static getConversationById(
    id: string
  ): Promise<ConversationWithParticipants | null> {
    return prisma.conversation.findUnique({
      where: { id },
      include: conversationWithParticipantsInclude,
    });
  }

  static async getUnreadCountsByConversation(
    userId: string,
    conversationIds: string[]
  ): Promise<Map<string, number>> {
    const map = new Map<string, number>();
    if (conversationIds.length === 0) {
      return map;
    }

    const grouped = await prisma.chatMessage.groupBy({
      by: ["conversationId"],
      where: {
        conversationId: { in: conversationIds },
        readAt: null,
        senderId: { not: userId },
      },
      _count: { _all: true },
    });

    for (const row of grouped) {
      map.set(row.conversationId, row._count._all);
    }
    return map;
  }

  static async listConversationsForUser(userId: string) {
    return prisma.conversation.findMany({
      where: {
        participants: { some: { userId } },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
        messages: {
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          take: 1,
          include: chatMessagePublicInclude,
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  }

  /** Page 1 = newest chunk; results are oldest → newest within the page. */
 static async listMessagesPage(
  conversationId: string,
  page?: number,
  limit?: number
): Promise<ChatMessageWithPublicRelations[]> {

  const skip =
    page !== undefined && limit !== undefined
      ? (page - 1) * limit
      : undefined;

  const rows = await prisma.chatMessage.findMany({
    where: { conversationId },

    include: chatMessagePublicInclude,

    orderBy: [{ createdAt: "desc" }, { id: "desc" }],

    ...(skip !== undefined ? { skip } : {}),
    ...(limit !== undefined ? { take: limit } : {}),
  });

  return rows.reverse();
}

  static async createMessage(data: {
    conversationId: string;
    senderId: string;
    content: string;
  }): Promise<ChatMessageWithPublicRelations> {
    return prisma.$transaction(async (tx) => {
      const message = await tx.chatMessage.create({
        data: {
          conversationId: data.conversationId,
          senderId: data.senderId,
          content: data.content,
        },
        include: chatMessagePublicInclude,
      });

      await tx.conversation.update({
        where: { id: data.conversationId },
        data: { updatedAt: new Date() },
      });

      return message;
    });
  }

  static getMessageById(
    messageId: string
  ): Promise<ChatMessageWithPublicRelations | null> {
    return prisma.chatMessage.findUnique({
      where: { id: messageId },
      include: chatMessagePublicInclude,
    });
  }

  static findMessageMeta(messageId: string) {
    return prisma.chatMessage.findUnique({
      where: { id: messageId },
      select: {
        id: true,
        conversationId: true,
        senderId: true,
        readAt: true,
      },
    });
  }

  static markMessageAsRead(
    messageId: string
  ): Promise<ChatMessageWithPublicRelations> {
    return prisma.chatMessage.update({
      where: { id: messageId },
      data: { readAt: new Date() },
      include: chatMessagePublicInclude,
    });
  }
}
