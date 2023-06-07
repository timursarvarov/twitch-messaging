import { Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { ChatService } from './chat.service';
import { AddMessageDto } from './dto/add-message.dto';

const defaultRoom = 'default';

@UsePipes(new ValidationPipe())
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {


  @WebSocketServer() server: Server = new Server();
  private connectedUsers: Map<string, string> = new Map();

  private logger = new Logger('ChatGateway');

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly chatService: ChatService,
  ) { }

  async handleConnection(socket: Socket): Promise<void> {
    const token = socket.handshake.query?.token?.toString();
    const payload = this.authService.verifyAccessToken(token);
    this.logger.log(`Socket connected: ${socket.id}`);
    const user = payload && (await this.userService.findOne(payload.id));

    if (!user) {
      socket.disconnect(true);
      this.logger.log(`Socket no user: ${socket.id}, socket disconnected`);
      return;
    }

    this.connectedUsers.set(socket.id, user._id.toString());
    return this.onChatJoin(socket);

  }

  async handleDisconnect(client: Socket) {
    const userId = this.connectedUsers.get(client.id);
    this.connectedUsers.delete(client.id);
    this.logger.log(`Socket leave: ${client.id}, user: ${userId}`);
    client.emit('message', 'leave ');
  }


  @SubscribeMessage('message')
  async onMessage(
    @MessageBody()
    payload: AddMessageDto
  ): Promise<boolean> {
    this.logger.log(payload);
    this.server.emit('message', payload);
    await this.chatService.addMessage(payload);
    return true;
  }

  async onChatJoin(client: Socket,) {
    const limit = 10;

    const userId = this.connectedUsers.get(client.id);
    const user = await this.userService.findOne(userId);

    if (!user) return;


    const messages = await this.chatService.getMessages(limit);

    client.join(defaultRoom);

    client.emit('message', messages);
  }
};
