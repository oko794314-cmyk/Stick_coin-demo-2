/**
 * Profile Module
 * Handles user profile and personal information
 */

import { ProfileUI } from './ui.js';
import { ProfileLogic } from './logic.js';
import { ProfileFirebase } from './firebase.js';

export class ProfileModule {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.ui = new ProfileUI();
    this.logic = new ProfileLogic();
    this.firebase = new ProfileFirebase();
  }

  async init() {
    await this.firebase.init();
    const profile = await this.logic.getProfile();
    this.ui.render(document.getElementById('profile-container'), profile);
  }

  async updateProfile(data) {
    return this.logic.updateProfile(data);
  }
}
