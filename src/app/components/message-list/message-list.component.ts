// src/app/components/message-list/message-list.component.ts
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from '../../services/message.service';
import { UserService } from '../../services/user.service';
import { Message } from '../../models/message.model';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  senderName: string = '';
  receiverName: string = '';
  newMessage: string = '';
  chatMessages: { content: string; senderName: string }[] = [];
  chatId: string | null = null;
  chatTitleSender: string = '';
  chatTitleReceiver: string = '';
  allChats: { senderName: string; receiverName: string }[] = [];

  constructor(
    private messageService: MessageService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadAllChats();  // Cargar todos los chats al inicio
  }

  // Método para cargar todos los chats al inicio
  loadAllChats(): void {
    this.messageService.getAllChats().subscribe(chats => {
      this.allChats = chats.map(chat => ({
        senderName: chat.senderName,
        receiverName: chat.receiverName
      }));
    });
  }

  // Método para enviar un mensaje
  sendMessage(): void {
    if (!this.senderName || !this.receiverName || !this.newMessage.trim()) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    this.userService.getUserByName(this.senderName).subscribe(sender => {
      if (!sender || !sender._id) {
        alert(`Usuario origen "${this.senderName}" no encontrado.`);
        return;
      }

      this.userService.getUserByName(this.receiverName).subscribe(receiver => {
        if (!receiver || !receiver._id) {
          alert(`Usuario destino "${this.receiverName}" no encontrado.`);
          return;
        }

        this.chatId = [sender._id, receiver._id].sort().join('-');
        this.chatTitleSender = this.senderName;
        this.chatTitleReceiver = this.receiverName;

        const message: Message = {
          chatId: this.chatId,
          senderId: sender._id,
          receiverId: receiver._id,
          content: this.newMessage,
          timestamp: new Date(),
          isRead: false,
          tags: []
        };

        this.messageService.createMessage(message).subscribe(sentMessage => {
          this.chatMessages.push({
            content: sentMessage.content,
            senderName: this.senderName
          });
          this.newMessage = ''; // Limpiar campo de mensaje
        });
      });
    });
  }

  // Método para cargar el chat entre los usuarios y mostrar los nombres en cada mensaje
  loadChat(senderName: string, receiverName: string): void {
    this.chatTitleSender = senderName;
    this.chatTitleReceiver = receiverName;

    this.userService.getUserByName(senderName).subscribe(sender => {
      if (!sender || !sender._id) {
        alert(`Usuario origen "${senderName}" no encontrado.`);
        return;
      }

      this.userService.getUserByName(receiverName).subscribe(receiver => {
        if (!receiver || !receiver._id) {
          alert(`Usuario destino "${receiverName}" no encontrado.`);
          return;
        }

        const chatId = [sender._id, receiver._id].sort().join('-');
        this.messageService.getChatMessages(chatId).subscribe(messages => {
          this.chatMessages = messages.map(message => ({
            content: message.content,
            senderName: message.senderId === sender._id ? senderName : receiverName
          }));
        });
      });
    });
  }
}
