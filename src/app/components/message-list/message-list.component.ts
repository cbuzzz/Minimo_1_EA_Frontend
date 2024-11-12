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
  chatMessages: { _id?: string; content: string; senderName: string; isEditing?: boolean }[] = [];
  chatId: string | null = null;
  chatTitleSender: string = '';
  chatTitleReceiver: string = '';
  allChats: { senderName: string; receiverName: string }[] = [];

  constructor(
    private messageService: MessageService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadAllChats();
  }

  // Método para cargar todos los chats
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
            _id: sentMessage._id,
            content: sentMessage.content,
            senderName: this.senderName,
            isEditing: false  // Añadir isEditing como falso inicialmente
          });
          this.newMessage = ''; // Limpiar campo de mensaje
        });
      });
    });
  }

  // Método para actualizar un mensaje
  updateMessage(id: string | undefined, updatedContent: string): void {
    if (!id) return; // Verificar que el ID no sea undefined
    this.messageService.updateMessage(id, { content: updatedContent }).subscribe(updatedMessage => {
      const index = this.chatMessages.findIndex(msg => msg._id === id);
      if (index !== -1) {
        this.chatMessages[index].content = updatedMessage.content;
        this.chatMessages[index].isEditing = false;  // Desactivar el modo de edición
      }
    });
  }

  // Método para eliminar un mensaje
  deleteMessage(id: string | undefined): void {
    if (!id) return; // Verificar que el ID no sea undefined
    this.messageService.deleteMessage(id).subscribe(response => {
      this.chatMessages = this.chatMessages.filter(msg => msg._id !== id);
    });
  }

  // Método para cargar el chat entre los usuarios y añadir isEditing a cada mensaje
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
            _id: message._id,
            content: message.content,
            senderName: message.senderId === sender._id ? senderName : receiverName,
            isEditing: false  // Añadir isEditing como falso inicialmente
          }));
        });
      });
    });
  }
}
