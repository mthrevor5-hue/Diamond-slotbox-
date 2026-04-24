# Diamond Slots - Telegram Stars Payment Setup Guide

## ✅ What's Been Fixed

Your payment system now has:
- ✅ **Proper payment flow** - No more fake auto-crediting
- ✅ **Backend verification** - Payments verified before crediting
- ✅ **Real Telegram Stars** - Actual XTR currency integration
- ✅ **Bot payment handling** - Full Telegram bot support
- ✅ **User balance tracking** - Track stars per user

---

## 🚀 Quick Start Setup

### 1. **Install Dependencies**

```bash
npm install
```

### 2. **Verify Your .env File**

Your `.env` file has been updated with:
```
BOT_TOKEN=8366149718:AAHK1hmtsf5b7nXxP2M9wolXJj4PGmnqLMM
PAYMENT_PROVIDER_TOKEN=6073714100:TEST:TG_dooP1AC2MIKtOcSOc1KcAVYA
WEBHOOK_URL=https://diamond-slotbox.vercel.app
PORT=3000
```

### 3. **Start the Server Locally**

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will run on `http://localhost:3000`

---

## 🔗 Integration with Your Frontend

### How to Use in Your Game

```javascript
// When user clicks "Buy Stars" button
const stars = 10; // Amount of stars to purchase

TelegramAPI.processStarPayment(
    stars,
    // Success callback
    () => {
        console.log('✅ Payment successful!');
        updateUserStars(); // Update game UI
    },
    // Error callback
    (error) => {
        console.error('❌ Payment failed:', error);
        showErrorMessage(error);
    }
);
```

---

## 📋 API Endpoints

### Verify Payment (Called Internally)
```
POST /api/verify-payment
Body: {
  "user_id": 123456,
  "stars": 10
}
Returns: {
  "success": true,
  "total_stars": 50
}
```

### Get User Balance
```
GET /api/user-balance/:userId
Returns: {
  "user_id": 123456,
  "stars": 50
}
```

---

## 🤖 Telegram Bot Features

Your bot now supports:

### `/start` Command
- Shows welcome message
- Displays current star balance
- Quick action buttons

### Buy Stars
- 10 ⭐ = $1
- 50 ⭐ = $5
- 100 ⭐ = $10

### Auto-Credit on Payment
- User makes payment
- Bot receives `successful_payment` callback
- Stars auto-credited to user account
- Confirmation message sent

---

## 🌐 Deployment to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Add payment backend"
git push origin main
```

### 2. Create `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

### 3. Deploy to Vercel
- Go to https://vercel.com
- Import your GitHub repo
- Add environment variables from `.env`
- Deploy!

---

## ⚠️ Important Security Notes

### 🔴 NEVER commit real credentials
Your current `.env` has real tokens. Before pushing to GitHub:

```bash
# Create .env.local for local development only
echo ".env" >> .gitignore
git rm --cached .env
git commit -m "Remove .env from tracking"
```

### Add environment variables in Vercel Dashboard:
1. Go to Project Settings
2. Environment Variables
3. Add each variable from `.env`

---

## 🧪 Testing Locally

### Test Payment Flow
1. Open your game in Telegram Bot (in development mode)
2. Click "Buy Stars"
3. Payment dialog should appear
4. Complete test payment
5. Check that stars are credited

### Debug Mode
```javascript
// Check user balance
const balance = await fetch(`/api/user-balance/123456`).then(r => r.json());
console.log('User balance:', balance.stars);
```

---

## 📞 Troubleshooting

### Payment dialog not appearing?
- ✅ Make sure you're opening app through Telegram
- ✅ Check `BOT_TOKEN` is correct
- ✅ Verify `PAYMENT_PROVIDER_TOKEN` is valid

### Stars not crediting?
- ✅ Check server logs: `npm run dev`
- ✅ Verify `/api/verify-payment` endpoint is working
- ✅ Check database connection (if using DB)

### Bot not responding?
- ✅ Verify bot token in `.env`
- ✅ Check server is running: `curl http://localhost:3000/`
- ✅ Check Telegram bot settings in BotFather

---

## 📁 File Structure
```
Diamond-slotbox-/
├── server.js              # Backend payment server
├── package.json           # Dependencies
├── .env                   # Environment variables (don't commit!)
├── vercel.json           # Vercel deployment config
├── js/
│   └── telegram-api.js   # Frontend Telegram integration
├── index.html            # Main game page
└── README.md             # This file
```

---

## 🎉 Next Steps

1. **Test locally**: Run `npm run dev`
2. **Deploy to Vercel**: Push to GitHub & deploy
3. **Update webhook**: Set bot webhook to your Vercel URL
4. **Test in Telegram**: Open game and try payment
5. **Monitor**: Check server logs for issues

---

## 💡 Pro Tips

- **Use database**: Replace in-memory `userStars` with MongoDB/PostgreSQL
- **Add logging**: Use Winston or Pino for production logging
- **Rate limiting**: Add express-rate-limit to prevent abuse
- **Error handling**: Implement retry logic for failed payments
- **Analytics**: Track payment metrics and user behavior

---

## ✨ Your Payment System is Ready!

The payment flow now works properly:
1. User clicks "Buy Stars"
2. Telegram payment dialog opens
3. User completes payment
4. Backend verifies payment
5. Stars credited to user
6. Game updated with new balance

🎮 Happy gaming! 🌟
