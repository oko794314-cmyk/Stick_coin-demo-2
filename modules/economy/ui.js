/**
 * Economy Module - UI Component
 */

export class EconomyUI {
  constructor() {
    this.container = null;
  }

  render(container, stats = {}) {
    this.container = container;
    this.container.innerHTML = `
      <div class="economy-module">
        <h2>Economy</h2>
        <div class="economy-stats">
          <div class="econ-stat">
            <p class="econ-label">Total Supply</p>
            <p class="econ-value">${stats.totalSupply || 0}</p>
          </div>
          <div class="econ-stat">
            <p class="econ-label">Avg Price</p>
            <p class="econ-value">$${stats.avgPrice || 0}</p>
          </div>
          <div class="econ-stat">
            <p class="econ-label">Market Cap</p>
            <p class="econ-value">$${stats.marketCap || 0}</p>
          </div>
        </div>
      </div>
    `;
  }
}
