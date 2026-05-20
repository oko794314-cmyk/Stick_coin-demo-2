/**
 * 🔄 ВАРІАНТ 2 - РЕАЛЬНА СИНХРОНІЗАЦІЯ JSONBIN
 * 
 * Система реального часу для автоматичного оновлення даних на JsonBin
 * при кожній зміні в додатку (майнинг, передача, чат, тощо).
 * 
 * Режими:
 * - Батч-синхронізація (групує оновлення кожні 2сек)
 * - Опитування даних друзів (кожні 3сек)
 * - Миттєві события (передача, чат)
 */

const REALTIME_CONFIG = {
    BATCH_SYNC_INTERVAL: 2000,      // 2 сек - групує батчи
    POLLING_INTERVAL: 3000,         // 3 сек - опитує оновлення від друзів
    IMMEDIATE_SYNC_DELAY: 100,      // 100мс - затримка для батчування
    MAX_BATCH_SIZE: 50              // макс операцій у батчі
};

let realtimeSyncState = {
    isEnabled: false,
    pendingUpdates: [],
    batchTimeout: null,
    pollingInterval: null,
    lastSyncTime: 0,
    syncCount: 0,
    lastPolledData: {}
};

/**
 * 🚀 ІНІЦІАЛІЗАЦІЯ РЕАЛЬНОЇ СИНХРОНІЗАЦІЇ
 */
function initRealtimeJsonBinSync() {
    if (realtimeSyncState.isEnabled) return;
    
    realtimeSyncState.isEnabled = true;
    console.log('🚀 ВАРІАНТ 2 активована: Реальна синхронізація JsonBin');
    
    // Запустити батч-синхронізацію
    startBatchSync();
    
    // Запустити опитування
    startPollingForUpdates();
    
    // Перехопити события
    setupEventListeners();
    
    console.log('✅ Система готова до роботи:');
    console.log('   - Батч-синхро кожні 2сек');
    console.log('   - Опитування кожні 3сек');
    console.log('   - Миттєві события синхро');
}

/**
 * 📤 ЗАПУСТИТИ БАТЧ-СИНХРОНІЗАЦІЮ
 * Групує оновлення та відправляє їх партіями
 */
function startBatchSync() {
    if (realtimeSyncState.pollingInterval) clearInterval(realtimeSyncState.pollingInterval);
    
    realtimeSyncState.pollingInterval = setInterval(() => {
        if (realtimeSyncState.pendingUpdates.length > 0) {
            syncToJsonBin();
        }
    }, REALTIME_CONFIG.BATCH_SYNC_INTERVAL);
}

/**
 * 📥 ЗАПУСТИТИ ОПИТУВАННЯ ДАНИХ
 * Перевіряє оновлення від друзів
 */
function startPollingForUpdates() {
    setInterval(() => {
        if (!gameState.user) return;
        
        pollFriendsData();
        pollFriendRequests();
    }, REALTIME_CONFIG.POLLING_INTERVAL);
}

/**
 * 🎯 ЗАПУСТИТИ МИТТЄВУ СИНХРОНІЗАЦІЮ
 * Для критичних операцій
 */
function triggerRealtimeSync(eventType) {
    if (!realtimeSyncState.isEnabled || !gameState.user) return;
    
    realtimeSyncState.pendingUpdates.push({
        type: eventType,
        timestamp: Date.now(),
        data: getSyncSnapshot()
    });
    
    // Для критичних событий - синхронізувати відразу
    if (['transfer', 'message', 'friend-accept', 'friend-remove'].includes(eventType)) {
        if (realtimeSyncState.batchTimeout) clearTimeout(realtimeSyncState.batchTimeout);
        realtimeSyncState.batchTimeout = setTimeout(() => {
            syncToJsonBin();
        }, REALTIME_CONFIG.IMMEDIATE_SYNC_DELAY);
    }
}

/**
 * 💾 ОСНОВНА ФУНКЦІЯ СИНХРОНІЗАЦІЇ
 */
async function syncToJsonBin() {
    if (!gameState.user || realtimeSyncState.pendingUpdates.length === 0) return;
    
    const startTime = performance.now();
    updateSyncIndicator(false); // Показати, що йде синхро
    
    try {
        // Оновити дані користувача перед відправкою
        saveUserData();
        
        // Відправити на JsonBin
        const response = await fetch(JSONBIN_API, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': JSONBIN_MASTER_KEY
            },
            body: JSON.stringify(allUsers)
        });

        if (response.ok) {
            const syncTime = performance.now() - startTime;
            realtimeSyncState.syncCount++;
            realtimeSyncState.lastSyncTime = Date.now();
            
            // Очистити батч
            const batchSize = realtimeSyncState.pendingUpdates.length;
            realtimeSyncState.pendingUpdates = [];
            
            updateSyncIndicator(true);
            
            console.log(`✅ Синхро #${realtimeSyncState.syncCount}: ${batchSize} операцій за ${syncTime.toFixed(0)}ms`);
            
            // Зберегти в localStorage як резервна копія
            localStorage.setItem('stick_users', JSON.stringify(allUsers));
            localStorage.setItem('last_sync', new Date().toISOString());
            
        } else {
            console.warn('⚠️ Помилка синхро:', response.status);
            updateSyncIndicator(false);
        }
    } catch (error) {
        console.error('❌ Помилка синхронізації:', error);
        updateSyncIndicator(false);
        
        // Запасний варіант - збереження в localStorage
        localStorage.setItem('stick_users', JSON.stringify(allUsers));
    }
}

/**
 * 🔍 ОПИТУВАННЯ ДАНИХ ДРУЗІВ
 * Перевіряє оновлення від друзів у реальному часі
 */
async function pollFriendsData() {
    try {
        const response = await fetch(JSONBIN_API, {
            method: 'GET',
            headers: { 'X-Master-Key': JSONBIN_MASTER_KEY }
        });

        if (response.ok) {
            const data = await response.json();
            const remoteUsers = data.record || {};
            
            // Перевірити оновлення від друзів
            gameState.friends.forEach(friend => {
                if (remoteUsers[friend] && remoteUsers[friend].balance !== allUsers[friend]?.balance) {
                    console.log(`🔄 Оновлено дані ${friend}: баланс змінився`);
                    allUsers[friend] = remoteUsers[friend];
                }
            });
            
        }
    } catch (error) {
        console.warn('⚠️ Помилка опитування:', error);
    }
}

/**
 * 📬 ОПИТУВАННЯ ЗАПИТІВ ВІД ДРУЗІВ
 */
async function pollFriendRequests() {
    try {
        const response = await fetch(JSONBIN_API, {
            method: 'GET',
            headers: { 'X-Master-Key': JSONBIN_MASTER_KEY }
        });

        if (response.ok) {
            const data = await response.json();
            const remoteUsers = data.record || {};
            
            if (remoteUsers[gameState.user]) {
                const newRequests = remoteUsers[gameState.user].friendRequests || [];
                
                // Перевірити нові запити
                newRequests.forEach(req => {
                    if (!gameState.friendRequests.includes(req)) {
                        gameState.friendRequests.push(req);
                        console.log(`📬 Новий запит від ${req}`);
                        updateFriendRequestsList();
                    }
                });
                
                // Оновити локальні дані
                allUsers[gameState.user].friendRequests = newRequests;
            }
        }
    } catch (error) {
        console.warn('⚠️ Помилка опитування запитів:', error);
    }
}

/**
 * 📸 ОТРИМАТИ СНІМОК ПОТОЧНИХ ДАНИХ
 */
function getSyncSnapshot() {
    return {
        user: gameState.user,
        balance: gameState.balance,
        mining: gameState.mining,
        friends: gameState.friends.length,
        messages: Object.keys(gameState.privateChatMessages).length
    };
}

/**
 * 🔧 НАЛАШТУВАННЯ СЛУХАЧІВ ПОДІЙ
 */
function setupEventListeners() {
    // Перехопити фокус на вікні
    window.addEventListener('focus', () => {
        console.log('👁️ Вікно активовано - перевірка оновлень');
        pollFriendsData();
        pollFriendRequests();
    });
    
    // Перехопити зміну видимості вкладки
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            console.log('📱 Вкладка видима - оновлення...');
            triggerRealtimeSync('tab-focus');
        }
    });
    
    // Перехопити перед вивантаженням сторінки
    window.addEventListener('beforeunload', () => {
        console.log('💾 Фінальна синхронізація...');
        syncToJsonBin();
    });
}

/**
 * 🎯 ОТРИМАТИ СТАТУС СИНХРОНІЗАЦІЇ
 */
function getSyncStatus() {
    return {
        enabled: realtimeSyncState.isEnabled,
        syncCount: realtimeSyncState.syncCount,
        lastSyncTime: realtimeSyncState.lastSyncTime,
        pendingUpdates: realtimeSyncState.pendingUpdates.length,
        secondsSinceLastSync: (Date.now() - realtimeSyncState.lastSyncTime) / 1000
    };
}

/**
 * 📊 ВИВЕСТИ СТАТИСТИКУ
 */
function logSyncStats() {
    const stats = getSyncStatus();
    console.log('📊 СТАТИСТИКА СИНХРОНІЗАЦІЇ:');
    console.log(`   Статус: ${stats.enabled ? '✅ АКТИВНА' : '❌ ВИМКНЕНА'}`);
    console.log(`   Всього синхро: ${stats.syncCount}`);
    console.log(`   Очікуючих операцій: ${stats.pendingUpdates}`);
    console.log(`   Часу з останної синхро: ${stats.secondsSinceLastSync.toFixed(1)}сек`);
    console.log(`   Last sync: ${new Date(stats.lastSyncTime).toLocaleTimeString('uk-UA')}`);
}

// Експортувати для доступу з основного скрипту
window.getSyncStatus = getSyncStatus;
window.logSyncStats = logSyncStats;
window.triggerRealtimeSync = triggerRealtimeSync;
window.initRealtimeJsonBinSync = initRealtimeJsonBinSync;

console.log('✅ realtime-jsonbin-sync.js завантажено');
