/**
 * Rankings Module - Business Logic
 */

export class RankingsLogic {
  constructor() {
    this.rankings = [
      { name: 'Player1', score: 10000 },
      { name: 'Player2', score: 9500 },
      { name: 'Player3', score: 9000 }
    ];
  }

  async getRankings(limit = 100) {
    return this.rankings.slice(0, limit);
  }

  calculateRank(score) {
    return this.rankings.findIndex(r => r.score <= score) + 1;
  }
}
