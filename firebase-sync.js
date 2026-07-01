/**
 * 🔥 FIREBASE REALTIME DATABASE - РЕАЛЬНА СИНХРОНІЗАЦІЯ
 * 
 * Використовує Firebase Realtime Database (bb-coin-8ec70) для:
 * - Чати - синхро в реальному часі
 * - Запити на дружбу - миттєвий прихід
 * - Запрошення на гру - блискавичне сповіщення
 * - Передача монет - інстантна
 * 
 * Конфіг завантажується з firebase-config.js (ініціалізується раніше).
 */

let firebaseState = {
    isInitialized: false,
    userListeners: {},
    chatListeners: {},
    friendRequestListeners: {},
    gameInvitationListeners: {},
    balanceListeners: {},
    onlineListeners: {},
    typingListeners: {}
};

/**
 * 🚀 ІНІЦІАЛІЗАЦІЯ FIREBASE
 * Firebase app ініціалізується в firebase-config.js (завантажується раніше).
 */
function initFirebaseSync() {
    if (firebaseState.isInitialized) return;
    
    if (!window.firebase) {
        console.error('❌ Firebase SDK не завантажено! Додайте скрипти в <head>');
        return;
    }
    
    if (!firebase.apps.length) {
        console.error('❌ Firebase не ініціалізований! Переконайтесь, що firebase-config.js завантажено перед firebase-sync.js');
        return;
    }
    
    firebaseState.isInitialized = true;
    const db = firebase.database();
    
    console.log('🔥 Firebase Realtime Database активована (bb-coin-8ec70)');
    console.log('✅ Миттєва синхронізація готова');
    
    return db;
}

/**
 * 💾 ЗБЕРЕГТИ ДАНІ КОРИСТУВАЧА В FIREBASE
 */
async function saveUserToFirebase(username, userData) {
    try {
        const db = firebase.database();
        await db.ref(`users/${username}`).set(userData);
        console.log(`✅ Користувач ${username} збережено в Firebase`);
        updateSyncIndicator(true);
        return true;
    } catch (error) {
        console.error('❌ Помилка збереження в Firebase:', error);
        updateSyncIndicator(false);
        return false;
    }
}

/**
 * 📥 ЗАВАНТАЖИТИ ДАНІ КОРИСТУВАЧА З FIREBASE
 */
async function loadUserFromFirebase(username) {
    try {
        const db = firebase.database();
        const snapshot = await db.ref(`users/${username}`).once('value');
        const userData = snapshot.val();
        console.log(`✅ Дані ${username} завантажені з Firebase`);
        return userData;
    } catch (error) {
        console.error('❌ Помилка завантаження з Firebase:', error);
        return null;
    }
}

/**
 * 👥 ЗАВАНТАЖИТИ ВСІ КОРИСТУВАЧІВ
 */
async function loadAllUsersFromFirebase() {
    try {
        const db = firebase.database();
        const snapshot = await db.ref('users').once('value');
        const users = snapshot.val() || {};
        console.log(`✅ Завантажено ${Object.keys(users).length} користувачів`);
        return users;
    } catch (error) {
        console.error('❌ Помилка завантаження користувачів:', error);
        return {};
    }
}

/**
 * 🔔 СЛУХАЧ ДЛЯ ЗАПИТІВ НА ДРУЖБУ - МИТТЄВО
 */
function setupFriendRequestListener(currentUser) {
    const db = firebase.database();
    const ref = db.ref(`users/${currentUser}/friendRequests`);
    
    // Видалити старий слухач
    if (firebaseState.friendRequestListeners[currentUser]) {
        ref.off('value', firebaseState.friendRequestListeners[currentUser]);
    }
    
    const listener = ref.on('value', (snapshot) => {
        const requests = snapshot.val() || [];
        
        // Перевірити нові запити
        if (gameState.friendRequests.length < requests.length) {
            const newRequests = requests.filter(req => !gameState.friendRequests.includes(req));
            
            newRequests.forEach(requester => {
                console.log(`📬 МИТТЄВИЙ ЗАПИТ ВІД: ${requester}`);
                showGameNotification(`📬 Запит на дружбу від ${requester}!`);
            });
        }
        
        gameState.friendRequests = requests;
        updateFriendRequestsList();
        
    }, (error) => {
        console.warn('⚠️ Помилка слухача запитів:', error);
    });
    
    firebaseState.friendRequestListeners[currentUser] = listener;
}

/**
 * 💬 СЛУХАЧ ДЛЯ ПРИВАТНИХ ЧАТІВ - МИТТЄВО
 */
function setupChatListener(currentUser, friendUsername) {
    const db = firebase.database();
    const chatKey = [currentUser, friendUsername].sort().join('_');
    const ref = db.ref(`chats/${chatKey}/messages`);
    
    // Видалити старий слухач
    if (firebaseState.chatListeners[chatKey]) {
        db.ref(`chats/${chatKey}/messages`).off('value', firebaseState.chatListeners[chatKey]);
    }
    
    const listener = ref.on('value', (snapshot) => {
        const messages = snapshot.val() || [];
        const realtimeHandler = window.stickChatRealtime && typeof window.stickChatRealtime.handleSnapshot === 'function'
            ? window.stickChatRealtime.handleSnapshot
            : (typeof window.handleRealtimeChatSnapshot === 'function' ? window.handleRealtimeChatSnapshot : null);

        if (realtimeHandler) {
            // Якщо UI зареєстрував власний обробник, передаємо дані й не дублюємо локальний рендер тут.
            realtimeHandler(friendUsername, messages);
            return;
        }
        
        if (gameState.currentChatFriend === friendUsername) {
            gameState.privateChatMessages[friendUsername] = messages;
            displayPrivateChat(); // Оновити екран миттєво
            console.log(`💬 Чат з ${friendUsername} оновлено`);
        }
        
    }, (error) => {
        console.warn('⚠️ Помилка слухача чату:', error);
    });
    
    firebaseState.chatListeners[chatKey] = listener;
}

/**
 * 📥 ЗАВАНТАЖИТИ ПОВІДОМЛЕННЯ ЧАТУ ОДИН РАЗ
 * Використовується як fallback polling, коли realtime listener недоступний.
 */
async function loadChatMessagesFirebase(currentUser, friendUsername) {
    try {
        const db = firebase.database();
        const chatKey = [currentUser, friendUsername].sort().join('_');
        const snapshot = await db.ref(`chats/${chatKey}/messages`).once('value');
        return snapshot.val() || [];
    } catch (error) {
        console.warn('⚠️ Помилка завантаження повідомлень чату:', error);
        return [];
    }
}

/**
 * 🎮 СЛУХАЧ ДЛЯ ЗАПРОШЕНЬ НА ГРУ - МИТТЄВО
 */
function setupGameInvitationListener(currentUser) {
    const db = firebase.database();
    const ref = db.ref(`users/${currentUser}/gameInvitations`);
    
    // Видалити старий слухач
    if (firebaseState.gameInvitationListeners[currentUser]) {
        ref.off('value', firebaseState.gameInvitationListeners[currentUser]);
    }
    
    const listener = ref.on('value', (snapshot) => {
        const invitations = snapshot.val() || {};
        
        // Перевірити нові запрошення
        Object.keys(invitations).forEach(inviteId => {
            const invite = invitations[inviteId];
            
            if (invite && invite.status === 'pending' && !invite.notified) {
                console.log(`🎮 МИТТЄВЕ ЗАПРОШЕННЯ НА ГРУ ВІД: ${invite.from}`);
                pendingGameRequest = invite;
                showGameRequestModal(invite);
                
                // Позначити як сповіщено
                db.ref(`users/${currentUser}/gameInvitations/${inviteId}/notified`).set(true);
            }
        });
        
        gameState.gameInvitations = invitations;
        
    }, (error) => {
        console.warn('⚠️ Помилка слухача запрошень:', error);
    });
    
    firebaseState.gameInvitationListeners[currentUser] = listener;
}

/**
 * 📤 ВІДПРАВИТИ ПРИВАТНЕ ПОВІДОМЛЕННЯ
 */
async function sendPrivateMessageFirebase(fromUser, toUser, message) {
    try {
        const db = firebase.database();
        const chatKey = [fromUser, toUser].sort().join('_');
        
        const newMessage = {
            from: fromUser,
            to: toUser,
            text: message,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        };
        
        // Додати повідомлення в чат
        await db.ref(`chats/${chatKey}/messages`).push(newMessage);
        
        // Позначити чат як активний
        await db.ref(`chats/${chatKey}/lastMessage`).set(newMessage);
        await db.ref(`chats/${chatKey}/lastMessageTime`).set(firebase.database.ServerValue.TIMESTAMP);
        
        console.log(`💬 Повідомлення надіслано ${toUser}`);
        updateSyncIndicator(true);
        return true;
        
    } catch (error) {
        console.error('❌ Помилка надіслання повідомлення:', error);
        updateSyncIndicator(false);
        return false;
    }
}

/**
 * 👥 ВІДПРАВИТИ ЗАПИТ НА ДРУЖБУ
 */
async function sendFriendRequestFirebase(fromUser, toUser) {
    try {
        const db = firebase.database();
        
        // Додати запит до списку запитів отримувача
        const snapshot = await db.ref(`users/${toUser}/friendRequests`).once('value');
        const requests = snapshot.val() || [];
        
        if (!requests.includes(fromUser)) {
            requests.push(fromUser);
            await db.ref(`users/${toUser}/friendRequests`).set(requests);
            
            console.log(`📬 Запит на дружбу від ${fromUser} до ${toUser} надіслано`);
            updateSyncIndicator(true);
            return true;
        }
        
        return false;
        
    } catch (error) {
        console.error('❌ Помилка надіслання запиту на дружбу:', error);
        updateSyncIndicator(false);
        return false;
    }
}

/**
 * ✅ ПРИЙНЯТИ ЗАПИТ НА ДРУЖБУ
 */
async function acceptFriendRequestFirebase(currentUser, requester) {
    try {
        const db = firebase.database();
        const currentRef = db.ref(`users/${currentUser}`);
        const requesterRef = db.ref(`users/${requester}`);

        const [currentSnapshot, requesterSnapshot] = await Promise.all([
            currentRef.once('value'),
            requesterRef.once('value')
        ]);

        const currentData = currentSnapshot.val();
        const requesterData = requesterSnapshot.val();

        if (!currentData || !requesterData) {
            throw new Error('Користувача не знайдено');
        }

        const currentRequests = (currentData.friendRequests || []).filter(name => name !== requester);
        const currentFriends = [...new Set([...(currentData.friends || []), requester])];
        const requesterFriends = [...new Set([...(requesterData.friends || []), currentUser])];

        await Promise.all([
            currentRef.child('friendRequests').set(currentRequests),
            currentRef.child('friends').set(currentFriends),
            requesterRef.child('friends').set(requesterFriends)
        ]);

        console.log(`✅ ${currentUser} прийняв запит від ${requester}`);
        updateSyncIndicator(true);
        return true;
    } catch (error) {
        console.error('❌ Помилка прийняття запиту:', error);
        updateSyncIndicator(false);
        return false;
    }
}

/**
 * ❌ ВІДХИЛИТИ ЗАПИТ НА ДРУЖБУ
 */
async function rejectFriendRequestFirebase(currentUser, requester) {
    try {
        const db = firebase.database();
        const currentRef = db.ref(`users/${currentUser}`);
        const snapshot = await currentRef.once('value');
        const currentData = snapshot.val();

        if (!currentData) {
            throw new Error('Користувача не знайдено');
        }

        const currentRequests = (currentData.friendRequests || []).filter(name => name !== requester);
        await currentRef.child('friendRequests').set(currentRequests);

        console.log(`❌ ${currentUser} відхилив запит від ${requester}`);
        updateSyncIndicator(true);
        return true;
    } catch (error) {
        console.error('❌ Помилка відхилення запиту:', error);
        updateSyncIndicator(false);
        return false;
    }
}

/**
 * ⚙️ ОНОВИТИ ПРОФІЛЬ КОРИСТУВАЧА
 */
async function updateUserProfileFirebase(username, updates) {
    try {
        const db = firebase.database();
        const allowedFields = ['avatar', 'displayName'];
        const safeUpdates = Object.fromEntries(
            Object.entries(updates).filter(([key]) => allowedFields.includes(key))
        );

        if (Object.keys(safeUpdates).length === 0) {
            throw new Error('Немає дозволених полів для оновлення');
        }

        await db.ref(`users/${username}`).update(safeUpdates);
        console.log(`⚙️ Профіль ${username} оновлено`);
        updateSyncIndicator(true);
        return true;
    } catch (error) {
        console.error('❌ Помилка оновлення профілю:', error);
        updateSyncIndicator(false);
        return false;
    }
}

/**
 * 🔒 ОНОВИТИ ПАРОЛЬ КОРИСТУВАЧА
 */
async function updateUserPasswordFirebase(username, password) {
    try {
        const db = firebase.database();
        await db.ref(`users/${username}/password`).set(password);
        console.log(`🔒 Пароль ${username} оновлено`);
        updateSyncIndicator(true);
        return true;
    } catch (error) {
        console.error('❌ Помилка оновлення пароля:', error);
        updateSyncIndicator(false);
        return false;
    }
}

/**
 * 🎮 ВІДПРАВИТИ ЗАПРОШЕННЯ НА ГРУ
 */
async function sendGameInvitationFirebase(fromUser, toUser, bet) {
    try {
        const db = firebase.database();
        const inviteId = Date.now().toString();
        
        const invitation = {
            id: inviteId,
            from: fromUser,
            to: toUser,
            bet: bet,
            status: 'pending',
            notified: false,
            createdAt: firebase.database.ServerValue.TIMESTAMP
        };
        
        await db.ref(`users/${toUser}/gameInvitations/${inviteId}`).set(invitation);
        
        console.log(`🎮 Запрошення на гру від ${fromUser} до ${toUser}`);
        updateSyncIndicator(true);
        return true;
        
    } catch (error) {
        console.error('❌ Помилка надіслання запрошення на гру:', error);
        updateSyncIndicator(false);
        return false;
    }
}

/**
 * 💳 ПЕРЕДАЧА МОНЕТ
 */
async function transferCoinsFirebase(fromUser, toUser, amount) {
    try {
        const db = firebase.database();
        
        // Завантажити дані обох користувачів
        const fromSnapshot = await db.ref(`users/${fromUser}`).once('value');
        const toSnapshot = await db.ref(`users/${toUser}`).once('value');
        
        const fromData = fromSnapshot.val();
        const toData = toSnapshot.val();
        
        if (!fromData || !toData) {
            throw new Error('Користувач не знайдений');
        }
        
        // Перевірити баланс
        if (fromData.balance < amount) {
            throw new Error('Недостатньо коштів');
        }
        
        // Виконати передачу
        fromData.balance -= amount;
        toData.balance += amount;
        
        // Зберегти зміни
        await db.ref(`users/${fromUser}/balance`).set(fromData.balance);
        await db.ref(`users/${toUser}/balance`).set(toData.balance);
        
        // Записати транзакцію в історію (non-critical — помилка не скасовує передачу)
        try {
            await db.ref(`transactions`).push({
                from: fromUser,
                to: toUser,
                amount: amount,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });
        } catch (txError) {
            console.warn('⚠️ Помилка запису транзакції (передача все одно виконана):', txError);
        }
        
        console.log(`💳 Передача ${amount} від ${fromUser} до ${toUser}`);
        updateSyncIndicator(true);
        return true;
        
    } catch (error) {
        console.error('❌ Помилка передачі:', error);
        updateSyncIndicator(false);
        return false;
    }
}

/**
 * ⛏️ ОНОВИТИ БАЛАНС ПІД ЧАС МАЙНИНГУ
 */
async function updateMiningBalanceFirebase(username, newBalance) {
    try {
        const db = firebase.database();
        await db.ref(`users/${username}/balance`).set(newBalance);
        await db.ref(`users/${username}/miningUpdatedAt`).set(firebase.database.ServerValue.TIMESTAMP);
        updateSyncIndicator(true);
        return true;
    } catch (error) {
        console.error('❌ Помилка оновлення балансу:', error);
        updateSyncIndicator(false);
        return false;
    }
}

/**
 * 💰 СЛУХАЧ БАЛАНСУ - МИТТЄВЕ ОНОВЛЕННЯ UI
 */
function setupBalanceListener(currentUser) {
    const db = firebase.database();
    const ref = db.ref(`users/${currentUser}/balance`);

    if (firebaseState.balanceListeners[currentUser]) {
        ref.off('value', firebaseState.balanceListeners[currentUser]);
    }

    const listener = ref.on('value', (snapshot) => {
        const newBalance = snapshot.val();
        if (newBalance === null || typeof newBalance !== 'number') return;
        if (newBalance !== gameState.balance) {
            gameState.balance = newBalance;
            if (typeof updateHeader === 'function') updateHeader();
        }
    }, (error) => {
        console.warn('⚠️ Помилка слухача балансу:', error);
    });

    firebaseState.balanceListeners[currentUser] = listener;
}

/**
 * 🟢 ВСТАНОВИТИ ОНЛАЙН-СТАТУС
 */
function setupOnlinePresence(currentUser) {
    const db = firebase.database();
    const onlineRef = db.ref(`users/${currentUser}/online`);
    onlineRef.set(true);
    onlineRef.onDisconnect().set(false);
}

/**
 * 🔴 ВСТАНОВИТИ ОФЛАЙН-СТАТУС
 */
function setOffline(currentUser) {
    try {
        const db = firebase.database();
        db.ref(`users/${currentUser}/online`).set(false);
    } catch (error) {
        console.warn('⚠️ Помилка встановлення офлайн:', error);
    }
}

/**
 * 👀 СЛУХАЧ ОНЛАЙН-СТАТУСУ ДРУГА
 */
function setupFriendOnlineListener(friendUsername, callback) {
    const db = firebase.database();
    const ref = db.ref(`users/${friendUsername}/online`);

    if (firebaseState.onlineListeners[friendUsername]) {
        ref.off('value', firebaseState.onlineListeners[friendUsername]);
    }

    const listener = ref.on('value', (snapshot) => {
        const isOnline = snapshot.val() === true;
        if (callback) callback(friendUsername, isOnline);
    }, (error) => {
        console.warn(`⚠️ Помилка слухача онлайн (${friendUsername}):`, error);
    });

    firebaseState.onlineListeners[friendUsername] = listener;
}

/**
 * ✏️ НАДІСЛАТИ ІНДИКАТОР НАБОРУ
 */
function sendTypingIndicator(currentUser, friendUsername) {
    try {
        const db = firebase.database();
        const chatKey = [currentUser, friendUsername].sort().join('_');
        db.ref(`chats/${chatKey}/typing/${currentUser}`).set(true);
    } catch (error) {
        console.warn('⚠️ Помилка індикатора набору:', error);
    }
}

/**
 * ✏️ ЗНЯТИ ІНДИКАТОР НАБОРУ
 */
function clearTypingIndicator(currentUser, friendUsername) {
    try {
        const db = firebase.database();
        const chatKey = [currentUser, friendUsername].sort().join('_');
        db.ref(`chats/${chatKey}/typing/${currentUser}`).set(false);
    } catch (error) {
        console.warn('⚠️ Помилка зняття індикатора набору:', error);
    }
}

/**
 * 👁️ СЛУХАЧ ІНДИКАТОРА НАБОРУ
 */
function setupTypingListener(currentUser, friendUsername, callback) {
    const db = firebase.database();
    const chatKey = [currentUser, friendUsername].sort().join('_');
    const ref = db.ref(`chats/${chatKey}/typing/${friendUsername}`);

    if (firebaseState.typingListeners[chatKey]) {
        db.ref(`chats/${chatKey}/typing/${friendUsername}`).off('value', firebaseState.typingListeners[chatKey]);
    }

    const listener = ref.on('value', (snapshot) => {
        const isTyping = snapshot.val() === true;
        if (callback) callback(isTyping);
    }, (error) => {
        console.warn(`⚠️ Помилка слухача набору (${friendUsername}):`, error);
    });

    firebaseState.typingListeners[chatKey] = listener;
}

/**
 * 🔇 ЗНЯТИ СЛУХАЧ ІНДИКАТОРА НАБОРУ
 */
function removeTypingListener(currentUser, friendUsername) {
    const db = firebase.database();
    const chatKey = [currentUser, friendUsername].sort().join('_');
    if (firebaseState.typingListeners[chatKey]) {
        db.ref(`chats/${chatKey}/typing/${friendUsername}`).off('value', firebaseState.typingListeners[chatKey]);
        delete firebaseState.typingListeners[chatKey];
    }
}

/**
 * 🎯 НАЛАШТУВАННЯ СЛУХАЧІВ ПРИ ВХОДІ
 */
function setupAllListenersOnLogin(currentUser) {
    console.log(`🔔 Налаштування слухачів для ${currentUser}...`);
    
    // Баланс — миттєве оновлення після передачі/майнингу
    setupBalanceListener(currentUser);
    
    // Онлайн-присутність
    setupOnlinePresence(currentUser);
    
    // Запити на дружбу
    setupFriendRequestListener(currentUser);
    
    // Запрошення на гру
    setupGameInvitationListener(currentUser);
    
    // Чати - налаштуються при вході у чат
    gameState.friends.forEach(friend => {
        setupChatListener(currentUser, friend);
    });

    // Онлайн-статус друзів
    gameState.friends.forEach(friend => {
        setupFriendOnlineListener(friend, (friendName, isOnline) => {
            if (!gameState) return;
            gameState.friendsOnline = gameState.friendsOnline || {};
            gameState.friendsOnline[friendName] = isOnline;
            if (typeof updateFriendsList === 'function') updateFriendsList();
            if (gameState.currentChatFriend === friendName && typeof updateChatOnlineDot === 'function') {
                updateChatOnlineDot(isOnline);
            }
        });
    });
    
    console.log(`✅ Всі слухачі налаштовані для ${currentUser}`);
}

/**
 * 🧹 ВИДАЛИТИ ВСІ СЛУХАЧІ
 */
function removeAllListeners() {
    const db = firebase.database();
    
    Object.keys(firebaseState.friendRequestListeners).forEach(user => {
        db.ref(`users/${user}/friendRequests`).off('value', firebaseState.friendRequestListeners[user]);
    });
    
    Object.keys(firebaseState.gameInvitationListeners).forEach(user => {
        db.ref(`users/${user}/gameInvitations`).off('value', firebaseState.gameInvitationListeners[user]);
    });
    
    Object.keys(firebaseState.chatListeners).forEach(chatKey => {
        db.ref(`chats/${chatKey}/messages`).off('value', firebaseState.chatListeners[chatKey]);
    });

    Object.keys(firebaseState.balanceListeners).forEach(user => {
        db.ref(`users/${user}/balance`).off('value', firebaseState.balanceListeners[user]);
    });

    Object.keys(firebaseState.onlineListeners).forEach(user => {
        db.ref(`users/${user}/online`).off('value', firebaseState.onlineListeners[user]);
    });

    Object.keys(firebaseState.typingListeners).forEach(chatKey => {
        db.ref(`chats/${chatKey}/typing`).off();
    });
    
    firebaseState.friendRequestListeners = {};
    firebaseState.gameInvitationListeners = {};
    firebaseState.chatListeners = {};
    firebaseState.balanceListeners = {};
    firebaseState.onlineListeners = {};
    firebaseState.typingListeners = {};
    
    console.log('🧹 Всі слухачі видалені');
}

/**
 * 📊 ОТРИМАТИ СТАТУС
 */
function getFirebaseStatus() {
    return {
        initialized: firebaseState.isInitialized,
        friendRequestListeners: Object.keys(firebaseState.friendRequestListeners).length,
        gameInvitationListeners: Object.keys(firebaseState.gameInvitationListeners).length,
        chatListeners: Object.keys(firebaseState.chatListeners).length
    };
}

// Експортувати функції
window.initFirebaseSync = initFirebaseSync;
window.saveUserToFirebase = saveUserToFirebase;
window.loadUserFromFirebase = loadUserFromFirebase;
window.loadAllUsersFromFirebase = loadAllUsersFromFirebase;
window.setupFriendRequestListener = setupFriendRequestListener;
window.setupChatListener = setupChatListener;
window.loadChatMessagesFirebase = loadChatMessagesFirebase;
window.setupGameInvitationListener = setupGameInvitationListener;
window.sendPrivateMessageFirebase = sendPrivateMessageFirebase;
window.sendFriendRequestFirebase = sendFriendRequestFirebase;
window.acceptFriendRequestFirebase = acceptFriendRequestFirebase;
window.rejectFriendRequestFirebase = rejectFriendRequestFirebase;
window.updateUserProfileFirebase = updateUserProfileFirebase;
window.updateUserPasswordFirebase = updateUserPasswordFirebase;
window.sendGameInvitationFirebase = sendGameInvitationFirebase;
window.transferCoinsFirebase = transferCoinsFirebase;
window.updateMiningBalanceFirebase = updateMiningBalanceFirebase;
window.setupBalanceListener = setupBalanceListener;
window.setupOnlinePresence = setupOnlinePresence;
window.setOffline = setOffline;
window.setupFriendOnlineListener = setupFriendOnlineListener;
window.sendTypingIndicator = sendTypingIndicator;
window.clearTypingIndicator = clearTypingIndicator;
window.setupTypingListener = setupTypingListener;
window.removeTypingListener = removeTypingListener;
window.setupAllListenersOnLogin = setupAllListenersOnLogin;
window.removeAllListeners = removeAllListeners;
window.getFirebaseStatus = getFirebaseStatus;

console.log('✅ firebase-sync.js завантажено');
