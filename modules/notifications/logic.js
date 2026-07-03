/**
 * Notifications Module - Business Logic
 */

export class NotificationsLogic {
  constructor() {
    this.notifications = [];
  }

  async getNotifications(limit = 50) {
    return this.notifications.slice(0, limit);
  }

  async addNotification(message, type = 'info') {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    this.notifications.unshift(notification);
    return notification;
  }

  removeNotification(notificationId) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
  }
}
