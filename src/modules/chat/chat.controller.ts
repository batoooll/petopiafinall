import type { Response, NextFunction } from "express";
import type { AuthRequest } from "@/common/middlewares/auth.middleware";
import type { ListMessagesQuery } from "./chat.dto";
import { ChatService } from "./chat.service";

export class ChatController {
  static getConversations = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await ChatService.getUserConversations(req.user!.userId);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  static getMessages = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const q = req.query as unknown as ListMessagesQuery;
      const data = await ChatService.getMessages(
        req.user!.userId,
        req.params.conversationId as string,
        q.page,
        q.limit
      );
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  static sendMessage = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await ChatService.sendMessage(req.user!.userId, req.body);
      res.status(201).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  static markMessageRead = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await ChatService.markMessageRead(
        req.user!.userId,
        req.params.messageId as string
      );
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };
}
