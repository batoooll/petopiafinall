import { AppError, HttpCode } from "@/common/errors/AppError";
import {
  ChatRepository,
  type ChatMessageWithPublicRelations,
  type ConversationWithParticipants,
} from "./chat.repository";
import { ChatPolicy } from "./chat.policy";
import type {
  ChatMessagePublic,
  ConversationListItem,
  PaginatedMessages,
} from "./chat.types";
import type { SendMessageDto } from "./chat.dto";
import { getChatIo } from "./chat.io";

export class ChatService {
  private static toIso(d: Date): string {
    return d.toISOString();
  }

  static toMessagePublic(
    m: ChatMessageWithPublicRelations
  ): ChatMessagePublic {
    return {
      id: m.id,
      conversationId: m.conversationId,
      senderId: m.senderId,
      content: m.content,
      createdAt: ChatService.toIso(m.createdAt),
      readAt: m.readAt ? ChatService.toIso(m.readAt) : null,
      sender: m.sender,
      asset: m.asset
        ? {
            id: m.asset.id,
            url: m.asset.url,
            mimeType: m.asset.mimeType,
            sizeBytes: m.asset.sizeBytes,
          }
        : null,
    };
  }

  private static broadcastToConversation(
    conversationId: string,
    event: string,
    payload: unknown
  ): void {
    const io = getChatIo();
    if (!io) {
      return;
    }
    io.to(ChatService.roomFor(conversationId)).emit(event, payload);
  }

  static roomFor(conversationId: string): string {
    return `conv:${conversationId}`;
  }

  static async assertConversationAccess(
    userId: string,
    conversationId: string
  ): Promise<ConversationWithParticipants> {
    const conversation = await ChatRepository.getConversationById(
      conversationId
    );
    if (!conversation) {
      throw new AppError("Conversation not found", HttpCode.NOT_FOUND);
    }
    ChatPolicy.ensureParticipant(conversation, userId);
    ChatPolicy.ensureExactlyTwoParticipants(conversation);
    const peerId = ChatPolicy.getOtherParticipantId(conversation, userId);
    await ChatPolicy.ensureActiveChatLink(userId, peerId);
    return conversation;
  }

  static async getUserConversations(
    userId: string
  ): Promise<{ conversations: ConversationListItem[] }> {
    const rows = await ChatRepository.listConversationsForUser(userId);
    const ids = rows.map((c) => c.id);
    const unreadMap = await ChatRepository.getUnreadCountsByConversation(
      userId,
      ids
    );

    const conversations: ConversationListItem[] = rows.map((c) => {
      const otherP = c.participants.find((p) => p.userId !== userId);
      if (!otherP) {
        throw new AppError(
          "Invalid conversation data",
          HttpCode.INTERNAL_SERVER_ERROR
        );
      }
      const last = c.messages[0];
      return {
        id: c.id,
        createdAt: ChatService.toIso(c.createdAt),
        updatedAt: ChatService.toIso(c.updatedAt),
        otherParticipant: {
          id: otherP.user.id,
          fullName: otherP.user.fullName,
          email: otherP.user.email,
        },
        lastMessage: last
          ? ChatService.omitConversationId(ChatService.toMessagePublic(last))
          : null,
        unreadCount: unreadMap.get(c.id) ?? 0,
      };
    });

    return { conversations };
  }

  private static omitConversationId(
    m: ChatMessagePublic
  ): Omit<ChatMessagePublic, "conversationId"> {
    const { conversationId: _c, ...rest } = m;
    return rest;
  }

  static async getMessages(
    userId: string,
    conversationId: string,
    page: number,
    limit: number
  ): Promise<PaginatedMessages> {
    await ChatService.assertConversationAccess(userId, conversationId);
    const rows = await ChatRepository.listMessagesPage(
      conversationId,
      page,
      limit
    );
    return {
      messages: rows.map((m) => ChatService.toMessagePublic(m)),
      page,
      limit,
    };
  }

  static async sendMessage(
    userId: string,
    dto: SendMessageDto
  ): Promise<ChatMessagePublic> {
    await ChatService.assertConversationAccess(userId, dto.conversationId);

    const created = await ChatRepository.createMessage({
      conversationId: dto.conversationId,
      senderId: userId,
      content: dto.content,
    });

    const publicMsg = ChatService.toMessagePublic(created);
    ChatService.broadcastToConversation(
      dto.conversationId,
      "chat:message",
      publicMsg
    );

    return publicMsg;
  }

  static async markMessageRead(
    userId: string,
    messageId: string
  ): Promise<ChatMessagePublic> {
    const meta = await ChatRepository.findMessageMeta(messageId);
    if (!meta) {
      throw new AppError("Message not found", HttpCode.NOT_FOUND);
    }

    await ChatService.assertConversationAccess(userId, meta.conversationId);

    if (meta.senderId === userId) {
      throw new AppError(
        "Cannot mark your own message as read",
        HttpCode.BAD_REQUEST
      );
    }

    if (meta.readAt) {
      const full = await ChatRepository.getMessageById(messageId);
      if (!full) {
        throw new AppError("Message not found", HttpCode.NOT_FOUND);
      }
      return ChatService.toMessagePublic(full);
    }

    const updated = await ChatRepository.markMessageAsRead(messageId);
    const publicMsg = ChatService.toMessagePublic(updated);

    ChatService.broadcastToConversation(meta.conversationId, "chat:read", {
      messageId: publicMsg.id,
      conversationId: meta.conversationId,
      readAt: publicMsg.readAt,
      readBy: userId,
    });

    return publicMsg;
  }
}
