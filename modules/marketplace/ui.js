/**
 * Marketplace Module - UI Component
 */

export class MarketplaceUI {
  constructor() {
    this.container = null;
  }

  render(container, items = []) {
    this.container = container;
    const itemsHTML = items.map(item => `
      <div class="marketplace-item">
        <h3>${item.name}</h3>
        <p class="item-price">💰 ${item.price} coins</p>
        <p class="item-seller">Seller: ${item.seller}</p>
        <button class="buy-button" data-item-id="${item.id}">Buy</button>
      </div>
    `).join('');

    this.container.innerHTML = `
      <div class="marketplace-module">
        <h2>Marketplace</h2>
        <div class="marketplace-grid">${itemsHTML || '<p>No items available</p>'}</div>
      </div>
    `;
  }
}
