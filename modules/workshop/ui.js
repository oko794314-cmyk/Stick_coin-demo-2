/**
 * Workshop Module - UI Component
 */

export class WorkshopUI {
  constructor() {
    this.container = null;
  }

  render(container) {
    this.container = container;
    this.container.innerHTML = `
      <div class="workshop-module">
        <h2>Workshop</h2>
        <div class="crafting-list">
          <div class="craft-item">
            <h3>Iron Sword</h3>
            <p class="craft-time">⏱️ 5 minutes</p>
            <button class="craft-button">Craft</button>
          </div>
          <div class="craft-item">
            <h3>Gold Armor</h3>
            <p class="craft-time">⏱️ 15 minutes</p>
            <button class="craft-button">Craft</button>
          </div>
        </div>
      </div>
    `;
  }
}
