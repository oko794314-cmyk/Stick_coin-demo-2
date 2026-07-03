# Stick Coin Demo - Modular Architecture

## 📋 Overview

Проєкт Stick Coin Demo побудований на 100% модульній архітектурі. Кожна вкладка — окремий модуль з власною логікою, UI та Firebase інтеграцією.

## 🏗️ Архітектура

```
modules/
├── exchange/        # Обмін криптовалюти
├── news/           # Новини
├── mining/         # Майнінг
├── casino/         # Казино
├── workshop/       # Крафтинг
├── marketplace/    # Магазин
├── profile/        # Профіль користувача
├── transfers/      # Переводи коїнів
├── economy/        # Економіка системи
├── buildings/      # Управління будівлями
├── rankings/       # Рейтинги гравців
└── notifications/  # Сповіщення

core/
├── StateManager.js     # Глобальне управління станом
└── ModuleManager.js    # Управління модулями
```

## 📦 Структура Модуля

Кожен модуль містить:

```
modules/[module_name]/
├── index.js       # Основний файл модуля (експорт класу)
├── ui.js          # UI компоненти
├── logic.js       # Бізнес-логіка
├── firebase.js    # Firebase інтеграція
└── styles.css     # Стилі модуля
```

### Приклад структури модуля:

**index.js** — Основний клас модуля
```javascript
export class ExchangeModule {
  constructor(stateManager) {
    this.stateManager = stateManager;
    this.ui = new ExchangeUI();
    this.logic = new ExchangeLogic();
    this.firebase = new ExchangeFirebase();
  }

  async init() {
    await this.firebase.init();
    this.ui.render(document.getElementById('exchange-container'));
  }
}
```

**ui.js** — UI компоненти
```javascript
export class ExchangeUI {
  render(container) {
    // Рендер UI
  }
}
```

**logic.js** — Бізнес-логіка
```javascript
export class ExchangeLogic {
  async executeExchange(from, to, amount) {
    // Логіка обміну
  }
}
```

**firebase.js** — Firebase операції
```javascript
export class ExchangeFirebase {
  async saveBet(bet) {
    // Збереження в Firebase
  }
}
```

## 🚀 Правила Розробки

### ✅ Дозволено
- Додавати нові вкладки (модулі)
- Додавати функції всередину модуля
- Використовувати API модулів
- Рефакторити код всередину модуля

### ❌ Заборонено
- Переписувати весь проєкт
- Змінювати чужі модулі
- Переносити логіку між файлами без потреби
- Ламати сумісність
- Використовувати глобальні змінні
- Дублювати код

## 🔌 Взаємодія Модулів

Модулі взаємодіють ТІЛЬКИ через:

1. **StateManager** — для спільного стану
```javascript
this.stateManager.setState('user', userData);
const user = this.stateManager.getState('user');
```

2. **API Модулів** — публічні методи
```javascript
const exchangeModule = moduleManager.getModule('exchange');
await exchangeModule.executeExchange(from, to, amount);
```

## 🛠️ Як Додати Новий Модуль

1. Створити папку `modules/[module_name]/`
2. Додати файли: `index.js`, `ui.js`, `logic.js`, `firebase.js`, `styles.css`
3. Імпортувати в `app.js`
4. Зареєструвати в `ModuleManager`

```javascript
import { MyModule } from './modules/my_module/index.js';

moduleManager.registerModule('mymodule', MyModule);
```

## 📊 State Management

### StateManager
- Централізоване управління станом
- Підписка на зміни
- Доступ з будь-якого модуля

```javascript
// Встановлення стану
stateManager.setState('gameData', data);

// Отримання стану
const data = stateManager.getState('gameData');

// Підписка на зміни
const unsubscribe = stateManager.subscribe((state) => {
  console.log('Стан змінився:', state);
});
```

## 🎯 Практики

- Кожен модуль незалежний
- Вся логіка в `logic.js`
- Весь UI в `ui.js`
- Весь Firebase код в `firebase.js`
- Спільні данні через StateManager
- API модулю через публічні методи в `index.js`

## 📝 License

MIT
