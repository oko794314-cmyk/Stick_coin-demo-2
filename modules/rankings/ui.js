/**
 * Rankings Module - UI Component
 */

export class RankingsUI {
  constructor() {
    this.container = null;
  }

  render(container, rankings = []) {
    this.container = container;
    const rankingsHTML = rankings.map((player, index) => `
      <tr class="ranking-row ${index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : ''}">
        <td class="rank-position">${index + 1}</td>
        <td class="rank-player">${player.name}</td>
        <td class="rank-score">${player.score}</td>
      </tr>
    `).join('');

    this.container.innerHTML = `
      <div class="rankings-module">
        <h2>Rankings</h2>
        <table class="rankings-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>${rankingsHTML || '<tr><td colspan="3">No rankings</td></tr>'}</tbody>
        </table>
      </div>
    `;
  }
}
