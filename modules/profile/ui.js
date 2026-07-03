/**
 * Profile Module - UI Component
 */

export class ProfileUI {
  constructor() {
    this.container = null;
  }

  render(container, profile = {}) {
    this.container = container;
    this.container.innerHTML = `
      <div class="profile-module">
        <div class="profile-header">
          <div class="profile-avatar">👤</div>
          <div class="profile-info">
            <h2>${profile.username || 'User'}</h2>
            <p class="profile-level">Level ${profile.level || 1}</p>
          </div>
        </div>
        <div class="profile-stats">
          <div class="stat">
            <p class="stat-name">Balance</p>
            <p class="stat-amount">${profile.balance || 0} coins</p>
          </div>
          <div class="stat">
            <p class="stat-name">Experience</p>
            <p class="stat-amount">${profile.experience || 0} XP</p>
          </div>
        </div>
      </div>
    `;
  }
}
