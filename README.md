# Diamond SlotBox - Telegram Mini App

A luxurious slot machine mini game for Telegram with real-time gameplay, leaderboards, and in-app purchases.

## Features

### 🎮 Gameplay
- **3-Reel Slot Machine** with 8 unique symbols
- **Jackpot System** - 3 matching symbols = massive rewards
- **Multiple Win Types**:
  - Money symbols (💰, 💵, 💸) for balance rewards
  - Premium symbols (👑, 💌, 🍿) for point rewards
  - Flash (⚡) for automatic respins
  - Red Diamond (💎) for penalties

### 💎 Rewards System
- **Tickets** (🎟️) - Currency to play
- **Balance** (💲) - Money won from spins
- **Diamonds** (💎) - Collected from special events
- **Points** (🎖️) - Used for leaderboard ranking

### 🏆 Leaderboard
- Top 10 players ranking
- 7-day countdown system
- Reward distribution:
  - 🥇 1st: 5 tickets
  - 🥈 2nd: 3 tickets
  - 🥉 3rd: 2 tickets
  - 4-10: 7 tickets split

### 🛍️ Shop
- Multiple ticket packages
- Premium pass option
- Telegram Star payments integration

### ⚙️ Settings
- Sound toggle
- Vibration toggle
- Notification settings
- Account management

### 📱 Telegram Integration
- Telegram Login
- Star payments
- Push notifications
- Bot messaging

## Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: LocalStorage + IndexedDB
- **Payment**: Telegram Stars API
- **Network**: Online/Offline detection

## Installation

1. Clone the repository
2. Deploy to a web server
3. Set up Telegram bot with Mini App
4. Configure Telegram API credentials

## Configuration

Update in `js/telegram-api.js`:
```javascript
static CLIENT_ID = 'YOUR_CLIENT_ID';
static CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
```

## Game Rules

### Money Symbols
- 💸 = $0.44 per reel (×3 = $1.32, Jackpot = $3.96)
- 💵 = $1.20 per reel (×3 = $3.60, Jackpot = $10.80)
- 💰 = $5.00 (Jackpot only)
- 3 of any = $6.46 ÷ 3 = $2.15 each

### Premium Symbols
- 👑 Crown = 1500 points per reel (×3 = 4500, Jackpot = 13500)
- 💌 Envelope = 500 points per reel (×3 = 1500, Jackpot = 4500)
- 🍿 Popcorn = 1000 points per reel (×3 = 3000, Jackpot = 9000)
- 3 of any = 3000 ÷ 3 = 1000 points

### Special Symbols
- ⚡ Flash = Auto-respin (Jackpot only) or -1 ticket
- 💎 Red Diamond = Point deduction
- 🏆 Trophy = Bonus multiplier

## License

MIT License - See LICENSE file for details

## Support

For issues and questions, please contact support through the app.
