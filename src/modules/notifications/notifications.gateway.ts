import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { UsersService } from '../users/users.service';
import { SocketClientData } from '../../common/interfaces/socket-client-data.interface';

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<number, Set<string>>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  extractTokenFromCookies(client: Socket) {
    interface JwtToken {
      type: string;
      token: string;
    }

    const cookies = client.handshake.headers.cookie;

    if (!cookies) {
      console.log('no cookies');
      console.log(cookies);
      return null;
    }

    const tokens: JwtToken[] = [];

    const splitedTokens = cookies.split('; ');

    splitedTokens.forEach((token) => {
      const splitedToken = token.split('=');

      const correctToken: JwtToken = {
        type: splitedToken[0],
        token: splitedToken[1],
      };

      tokens.push(correctToken);
    });

    const accessToken = tokens.find(
      (token) => token.type === 'accessToken',
    )?.token;

    console.log('extract');

    return accessToken;
  }

  async handleConnection(client: Socket) {
    try {
      const accessToken = this.extractTokenFromCookies(client);

      if (!accessToken) {
        Logger.error('disconnected_1');
        return client.disconnect();
      }

      const payload: JwtPayload = await this.jwtService.verifyAsync(
        accessToken,
        {
          secret: process.env.JWT_ACCESS_SECRET_KEY,
        },
      );

      const user = await this.usersService.findByEmail(payload.email);

      if (!user) {
        Logger.error('disconnected_2');
        return client.disconnect();
      }

      if (!this.userSockets.has(user.id)) {
        this.userSockets.set(user.id, new Set());
      }

      console.log('user');

      this.userSockets.get(user.id)?.add(client.id);

      client.data = {
        userId: user.id,
        email: user.email,
      };

      Logger.log(`${user.email} connected`);
    } catch (error) {
      Logger.error(`Connection error for ${client.id}:`, error);
      client.disconnect();
    }
  }

  sendMessageToClient(userId: number, event: string, message: string) {
    const socketIds = this.userSockets.get(userId);

    if (socketIds && socketIds.size > 0) {
      socketIds.forEach((socketId) => {
        this.server.to(socketId).emit(event, message);
      });
    }
  }

  handleDisconnect(client: Socket) {
    const { userId } = client.data as SocketClientData;

    if (userId && this.userSockets.has(userId)) {
      this.userSockets.get(userId)?.delete(client.id);
    }

    if (this.userSockets.get(userId)?.size === 0) {
      this.userSockets.delete(userId);
    }
  }
}
