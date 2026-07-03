/**
 * Mining Module - UI Component
 */

export class MiningUI {
  constructor() {
    this.container = null;
  }

  render(container) {
    this.container = container;
    this.container.innerHTML = `
      <div class="mining-module">
        <h2>Mining</h2>
        <div class="mining-stats">
          <div class="stat-card">
            <p class="stat-label">Hash Rate</p>
            <p class="stat-value" id="hash-rate">0 H/s</p>
          </div>
          <div class="stat-card">
            <p class="stat-label">Earned Today</p>
            <p class="stat-value" id="earned-today">0 coins</p>
          </div>
        </div>
        <div class="mining-controls">
          <button id="start-mining" class="mining-button mining-start">Start Mining</button>
          <button id="stop-mining" class="mining-button mining-stop" disabled>Stop Mining</button>
        </div>
      </div>
    `;
  }

  updateStats(stats) {
    document.getElementById('hash-rate').textContent = stats.hashRate;
    document.getElementById('earned-today').textContent = stats.earnedToday;
  }
}
