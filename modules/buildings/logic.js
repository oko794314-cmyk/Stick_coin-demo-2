/**
 * Buildings Module - Business Logic
 */

export class BuildingsLogic {
  constructor() {
    this.buildings = [
      { id: 1, name: 'Farm', level: 1, production: 10 },
      { id: 2, name: 'Factory', level: 1, production: 50 }
    ];
  }

  async getBuildings() {
    return this.buildings;
  }

  async upgradeBuilding(buildingId) {
    const building = this.buildings.find(b => b.id === buildingId);
    if (!building) {
      return { success: false, error: 'Building not found' };
    }

    building.level += 1;
    building.production = Math.floor(building.production * 1.5);

    return { success: true, building };
  }
}
