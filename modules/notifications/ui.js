/**
 * Notifications Module - UI Component
 */

export class NotificationsUI {
  constructor() {
    this.container = null;
  }

  render(container, notifications = []) {
    this.container = container;
    const notificationsHTML = notifications.map(notif => `
      <div class="notification notification-${notif.type}">
        <p>${notif.message}</p>
        <button class="notification-close" data-id="${notif.id}">✕</button>
      </div>
    `).join('');

    this.container.innerHTML = `
      <div class="notifications-module">${notificationsHTML || ''}</div>
    `;
  }

  showNotification(message, type = 'info') {
    const notif = document.createElement('div');
    notif.className = `notification notification-${type}`;
    notif.innerHTML = `<p>${message}</p>`;
    this.container.appendChild(notif);
  }
}
