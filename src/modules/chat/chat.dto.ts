import { z } from "zod";

const cuid = z.string().cuid();

export const SendMessageSchema = z.object({
  conversationId: cuid,
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(2000)
    .transform((s) => s.replace(/\0/g, "").trim()),
});

export type SendMessageDto = z.infer<typeof SendMessageSchema>;

export const ConversationIdParamsSchema = z.object({
  conversationId: cuid,
});

export const MessageIdParamsSchema = z.object({
  messageId: cuid,
});

export const ListMessagesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export type ListMessagesQuery = z.infer<typeof ListMessagesQuerySchema>;
