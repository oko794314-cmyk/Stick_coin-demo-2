/**
 * Buildings Module - UI Component
 */

export class BuildingsUI {
  constructor() {
    this.container = null;
  }

  render(container, buildings = []) {
    this.container = container;
    const buildingsHTML = buildings.map(building => `
      <div class="building-card">
        <h3>${building.name}</h3>
        <p class="building-level">Level ${building.level}</p>
        <p class="building-production">📦 ${building.production}/hour</p>
        <button class="upgrade-btn" data-building-id="${building.id}">Upgrade</button>
      </div>
    `).join('');

    this.container.innerHTML = `
      <div class="buildings-module">
        <h2>Buildings</h2>
        <div class="buildings-grid">${buildingsHTML || '<p>No buildings</p>'}</div>
      </div>
    `;
  }
}
