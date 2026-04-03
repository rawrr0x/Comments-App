import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(private readonly notificationsGateway: NotificationsGateway) {}

  async notifyUser(userId: number, message: string) {
    return this.notificationsGateway.sendMessageToClient(
      userId,
      'notification',
      message,
    );
  }
}
