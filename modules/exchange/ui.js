/**
 * Exchange Module - UI Component
 */

export class ExchangeUI {
  constructor() {
    this.container = null;
  }

  render(container) {
    this.container = container;
    this.container.innerHTML = `
      <div class="exchange-module">
        <h2>Exchange</h2>
        <div class="exchange-form">
          <select id="from-currency" class="exchange-select">
            <option value="BTC">Bitcoin</option>
            <option value="ETH">Ethereum</option>
            <option value="USD">USD</option>
          </select>
          <input type="number" id="amount" class="exchange-input" placeholder="Amount">
          <select id="to-currency" class="exchange-select">
            <option value="USD">USD</option>
            <option value="BTC">Bitcoin</option>
            <option value="ETH">Ethereum</option>
          </select>
          <button id="exchange-btn" class="exchange-button">Exchange</button>
        </div>
        <div id="exchange-result" class="exchange-result"></div>
      </div>
    `;
  }

  updateResult(result) {
    const resultDiv = document.getElementById('exchange-result');
    resultDiv.innerHTML = `<p>${result}</p>`;
  }
}
