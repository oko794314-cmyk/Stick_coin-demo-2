/**
 * Transfers Module - Business Logic
 */

export class TransfersLogic {
  constructor() {
    this.transactions = [];
  }

  async sendCoins(recipientId, amount) {
    if (amount <= 0) {
      return { success: false, error: 'Amount must be positive' };
    }

    try {
      const transaction = {
        id: Date.now(),
        recipientId,
        amount,
        timestamp: new Date()
      };
      this.transactions.push(transaction);
      return { success: true, transaction };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
