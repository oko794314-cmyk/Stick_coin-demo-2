/**
 * Workshop Module - Business Logic
 */

export class WorkshopLogic {
  constructor() {
    this.craftingQueue = [];
    this.craftingItems = [
      { id: 1, name: 'Iron Sword', time: 300, cost: 100 },
      { id: 2, name: 'Gold Armor', time: 900, cost: 500 }
    ];
  }

  async craftItem(itemId) {
    const item = this.craftingItems.find(i => i.id === itemId);
    if (!item) {
      return { success: false, error: 'Item not found' };
    }

    this.craftingQueue.push({
      itemId,
      startTime: Date.now(),
      endTime: Date.now() + item.time * 1000
    });

    return { success: true, item };
  }
}
