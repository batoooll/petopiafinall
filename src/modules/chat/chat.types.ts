export type ChatParticipantPreview = {
  id: string;
  fullName: string;
  email: string;
};

export type ChatAssetPreview = {
  id: string;
  url: string;
  mimeType: string | null;
  sizeBytes: number | null;
};

export type ChatMessagePublic = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string | null;
  createdAt: string;
  readAt: string | null;
  sender: {
    id: string;
    fullName: string;
  };
  asset: ChatAssetPreview | null;
};

export type ConversationListItem = {
  id: string;
  createdAt: string;
  updatedAt: string;
  otherParticipant: ChatParticipantPreview;
  lastMessage: Omit<ChatMessagePublic, "conversationId"> | null;
  unreadCount: number;
};

export type PaginatedMessages = {
  messages: ChatMessagePublic[];
  page: number;
  limit: number;
};
