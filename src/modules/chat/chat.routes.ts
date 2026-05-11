import { Router } from "express";
import { protect } from "@/common/middlewares/auth.middleware";
import {
  validate,
  validateParams,
  validateQuery,
} from "@/common/middlewares/validate.middleware";
import { ChatController } from "./chat.controller";
import {
  ConversationIdParamsSchema,
  ListMessagesQuerySchema,
  MessageIdParamsSchema,
  SendMessageSchema,
} from "./chat.dto";

const router = Router();

router.use(protect);

router.get("/conversations", ChatController.getConversations);

router.get(
  "/conversations/:conversationId/messages",
  validateParams(ConversationIdParamsSchema),
  validateQuery(ListMessagesQuerySchema),
  ChatController.getMessages
);

router.post(
  "/messages",
  validate(SendMessageSchema),
  ChatController.sendMessage
);

router.patch(
  "/messages/:messageId/read",
  validateParams(MessageIdParamsSchema),
  ChatController.markMessageRead
);

export default router;
