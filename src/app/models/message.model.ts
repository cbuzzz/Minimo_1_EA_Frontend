// src/app/models/message.model.ts
export interface Message {
    _id?: string;
    chatId: string;
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: Date;
    isRead: boolean;
    tags: string[];
    senderName?: string;  // Agrega senderName como opcional
    receiverName?: string;  // Agrega receiverName como opcional
  }
  