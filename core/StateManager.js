/**
 * Global State Manager
 * Manages state across all modules
 */

export class StateManager {
  constructor() {
    this.state = {};
    this.listeners = [];
  }

  setState(key, value) {
    this.state[key] = value;
    this.notifyListeners();
  }

  getState(key) {
    return this.state[key];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }
}
