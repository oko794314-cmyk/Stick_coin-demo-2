/**
 * Transfers Module - UI Component
 */

export class TransfersUI {
  constructor() {
    this.container = null;
  }

  render(container) {
    this.container = container;
    this.container.innerHTML = `
      <div class="transfers-module">
        <h2>Send Coins</h2>
        <div class="transfer-form">
          <input type="text" id="recipient" class="transfer-input" placeholder="Recipient ID">
          <input type="number" id="amount" class="transfer-input" placeholder="Amount">
          <button id="send-btn" class="transfer-button">Send</button>
        </div>
        <div id="transfer-history" class="transfer-history"></div>
      </div>
    `;
  }
}
