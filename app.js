/**
 * Main Application Entry Point
 * Initializes all modules and state management
 */

import { StateManager } from './core/StateManager.js';
import { ModuleManager } from './core/ModuleManager.js';

import { ExchangeModule } from './modules/exchange/index.js';
import { NewsModule } from './modules/news/index.js';
import { MiningModule } from './modules/mining/index.js';
import { CasinoModule } from './modules/casino/index.js';
import { WorkshopModule } from './modules/workshop/index.js';
import { MarketplaceModule } from './modules/marketplace/index.js';
import { ProfileModule } from './modules/profile/index.js';
import { TransfersModule } from './modules/transfers/index.js';
import { EconomyModule } from './modules/economy/index.js';
import { BuildingsModule } from './modules/buildings/index.js';
import { RankingsModule } from './modules/rankings/index.js';
import { NotificationsModule } from './modules/notifications/index.js';

// Initialize state manager
const stateManager = new StateManager();

// Initialize module manager
const moduleManager = new ModuleManager(stateManager);

// Register all modules
moduleManager.registerModule('exchange', ExchangeModule);
moduleManager.registerModule('news', NewsModule);
moduleManager.registerModule('mining', MiningModule);
moduleManager.registerModule('casino', CasinoModule);
moduleManager.registerModule('workshop', WorkshopModule);
moduleManager.registerModule('marketplace', MarketplaceModule);
moduleManager.registerModule('profile', ProfileModule);
moduleManager.registerModule('transfers', TransfersModule);
moduleManager.registerModule('economy', EconomyModule);
moduleManager.registerModule('buildings', BuildingsModule);
moduleManager.registerModule('rankings', RankingsModule);
moduleManager.registerModule('notifications', NotificationsModule);

// Initialize all modules
window.addEventListener('load', async () => {
  await moduleManager.initializeAll();
  console.log('✅ All modules initialized successfully!');
});

// Navigation
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const moduleName = link.dataset.module;
    console.log(`Navigating to ${moduleName}`);
  });
});

// Export for debugging
window.stateManager = stateManager;
window.moduleManager = moduleManager;
