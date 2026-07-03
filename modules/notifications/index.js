/**
 * Notifications Module
 * Handles user notifications and alerts
 */

import { NotificationsUI } from './ui.js';
import { NotificationsLogic } from './logic.js';
import { NotificationsFirebase } from './firebase.js';

export class NotificationsModule {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.ui = new NotificationsUI();
    this.logic = new NotificationsLogic();
    this.firebase = new NotificationsFirebase();
  }

  async init() {
    await this.firebase.init();
    const notifications = await this.logic.getNotifications();
    this.ui.render(document.getElementById('notifications-container'), notifications);
  }

  async addNotification(message, type = 'info') {
    return this.logic.addNotification(message, type);
  }
}
