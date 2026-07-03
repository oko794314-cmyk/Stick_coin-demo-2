/**
 * Profile Module - Business Logic
 */

export class ProfileLogic {
  constructor() {
    this.profile = {
      username: 'Player',
      level: 1,
      balance: 0,
      experience: 0
    };
  }

  async getProfile() {
    return this.profile;
  }

  async updateProfile(data) {
    this.profile = { ...this.profile, ...data };
    return { success: true, profile: this.profile };
  }
}
