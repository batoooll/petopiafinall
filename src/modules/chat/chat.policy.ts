import { AppError, HttpCode } from "@/common/errors/AppError";
import type { ConversationWithParticipants } from "./chat.repository";
import { ChatRepository } from "./chat.repository";

export class ChatPolicy {
  static ensureExactlyTwoParticipants(
    conversation: ConversationWithParticipants
  ): void {
    if (conversation.participants.length !== 2) {
      throw new AppError(
        "Invalid conversation configuration",
        HttpCode.FORBIDDEN
      );
    }
  }

  static ensureParticipant(
    conversation: ConversationWithParticipants,
    userId: string
  ): void {
    const isParticipant = conversation.participants.some(
      (p) => p.userId === userId
    );
    if (!isParticipant) {
      throw new AppError(
        "Unauthorized conversation access",
        HttpCode.FORBIDDEN
      );
    }
  }

  static getOtherParticipantId(
    conversation: ConversationWithParticipants,
    userId: string
  ): string {
    const other = conversation.participants.find((p) => p.userId !== userId);
    if (!other) {
      throw new AppError(
        "Unauthorized conversation access",
        HttpCode.FORBIDDEN
      );
    }
    return other.userId;
  }

  /**
   * Chat only if there is an accepted pet match or an accepted/completed sitting booking.
   */
  static async ensureActiveChatLink(
    userId: string,
    peerId: string
  ): Promise<void> {
    const ok = await ChatRepository.hasActiveChatLink(userId, peerId);
    if (!ok) {
      throw new AppError(
        "Messaging is not allowed for this conversation",
        HttpCode.FORBIDDEN
      );
    }
  }
}
