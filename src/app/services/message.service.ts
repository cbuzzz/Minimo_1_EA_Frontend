// src/app/services/message.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = 'http://localhost:3000/api/messages';

  constructor(private http: HttpClient) {}

  createMessage(message: Message): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/send`, message);
  }

  getChatMessages(chatId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/chat/${chatId}`);
  }

  getAllChats(): Observable<{ senderName: string, receiverName: string }[]> {
    return this.http.get<{ senderName: string, receiverName: string }[]>(`${this.apiUrl}/allChats`);
  }

  getMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(this.apiUrl);
  }

  getUnreadMessages(userId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/unread/${userId}`);
  }
}
