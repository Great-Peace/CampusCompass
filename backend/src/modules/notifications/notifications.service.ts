import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../../database/repositories/notification.repository';
import { UserRepository } from '../../database/repositories/user.repository';
import { NotificationType } from '../../database/entities/notification.entity';

interface CreateNotificationDto {
  userId: string;
  type: NotificationType | string;
  title: string;
  message: string;
  data?: Record<string, any>;
}

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const notification = await this.notificationRepository.create(createNotificationDto);

    // Send push notification via FCM if user has FCM token
    const user = await this.userRepository.findById(createNotificationDto.userId);
    
    if (user?.fcmToken) {
      await this.sendPushNotification(user.fcmToken, notification);
    }

    return notification;
  }

  async findByUser(userId: string, unreadOnly: boolean = false) {
    return this.notificationRepository.findByUser(userId, unreadOnly);
  }

  async markAsRead(notificationId: string) {
    return this.notificationRepository.markAsRead(notificationId);
  }

  async markAllAsRead(userId: string) {
    return this.notificationRepository.markAllAsRead(userId);
  }

  async getUnreadCount(userId: string) {
    return this.notificationRepository.getUnreadCount(userId);
  }

  async sendBulkNotification(userIds: string[], notification: Omit<CreateNotificationDto, 'userId'>) {
    const notifications = await Promise.all(
      userIds.map((userId) =>
        this.create({
          userId,
          ...notification,
        }),
      ),
    );

    return notifications;
  }

  private async sendPushNotification(fcmToken: string, notification: any) {
    // Implement FCM push notification
    // This requires firebase-admin setup
    try {
      // const admin = require('firebase-admin');
      // await admin.messaging().send({
      //   token: fcmToken,
      //   notification: {
      //     title: notification.title,
      //     body: notification.message,
      //   },
      //   data: notification.data || {},
      // });
      console.log('Push notification sent to:', fcmToken);
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  }
}