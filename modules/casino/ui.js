/**
 * Casino Module - UI Component
 */

export class CasinoUI {
  constructor() {
    this.container = null;
  }

  render(container) {
    this.container = container;
    this.container.innerHTML = `
      <div class="casino-module">
        <h2>Casino</h2>
        <div class="casino-games">
          <div class="game-card" data-game="dice">
            <h3>Dice</h3>
            <p>Roll and win!</p>
          </div>
          <div class="game-card" data-game="slots">
            <h3>Slots</h3>
            <p>Spin to win!</p>
          </div>
          <div class="game-card" data-game="roulette">
            <h3>Roulette</h3>
            <p>Pick your number!</p>
          </div>
        </div>
      </div>
    `;
  }
}
