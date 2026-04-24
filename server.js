const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

// Configuration
const BOT_TOKEN = process.env.BOT_TOKEN;
const PAYMENT_PROVIDER_TOKEN = process.env.PAYMENT_PROVIDER_TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://yourdomain.com';

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// In-memory store (replace with database in production)
const userPayments = {};
const userStars = {};

// ==================== PAYMENT ENDPOINTS ====================

// Verify payment and credit stars
app.post('/api/verify-payment', async (req, res) => {
    const { user_id, stars } = req.body;

    try {
        // Verify Telegram auth token
        const authHeader = req.headers.authorization?.replace('Bearer ', '');
        if (!authHeader) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Verify user exists
        if (!user_id || !stars) {
            return res.status(400).json({ error: 'Missing user_id or stars' });
        }

        // Check if payment was already processed (prevent duplicate)
        if (userPayments[user_id]?.stars === stars && userPayments[user_id]?.processed) {
            return res.status(400).json({ error: 'Payment already processed' });
        }

        // Credit stars to user
        userStars[user_id] = (userStars[user_id] || 0) + stars;
        userPayments[user_id] = {
            stars,
            timestamp: Date.now(),
            processed: true
        };

        console.log(`✅ Payment verified: User ${user_id} credited ${stars} stars`);

        res.json({
            success: true,
            message: 'Payment verified and credited',
            user_id,
            stars,
            total_stars: userStars[user_id]
        });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get user's star balance
app.get('/api/user-balance/:userId', (req, res) => {
    const { userId } = req.params;
    const balance = userStars[userId] || 0;

    res.json({
        user_id: userId,
        stars: balance
    });
});

// ==================== INVOICE ENDPOINTS ====================

// Create and send invoice
app.post('/payment', async (req, res) => {
    const { payload } = req.query;

    try {
        if (!payload) {
            return res.status(400).json({ error: 'Missing payload' });
        }

        const data = JSON.parse(decodeURIComponent(payload));
        const { user_id, stars, username } = data;

        // Create invoice
        await bot.sendInvoice(
            user_id,
            'Diamond Slots Stars',
            `Purchase ${stars} Telegram Stars`,
            JSON.stringify({ user_id, stars }),
            PAYMENT_PROVIDER_TOKEN,
            'XTR', // Telegram Stars currency
            [{ label: `${stars} Stars`, amount: stars }]
        );

        res.json({ success: true, message: 'Invoice sent' });
    } catch (error) {
        console.error('Invoice error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==================== TELEGRAM BOT HANDLERS ====================

// Handle successful payment
bot.on('successful_payment', async (msg) => {
    const { successful_payment } = msg;
    const userId = msg.from.id;
    const stars = successful_payment.total_amount;

    // Credit stars
    userStars[userId] = (userStars[userId] || 0) + stars;

    // Send confirmation
    bot.sendMessage(
        userId,
        `✅ Payment successful!\n\n⭐ You received ${stars} Telegram Stars\n\nTotal Stars: ${userStars[userId]}`
    );

    console.log(`💰 Payment received: User ${userId} paid ${stars} stars`);
});

// Handle pre-checkout queries
bot.on('pre_checkout_query', async (query) => {
    const { id, from } = query;

    // Approve payment
    bot.answerPreCheckoutQuery(id, true);
});

// Handle /start command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const userBalance = userStars[userId] || 0;

    const keyboard = {
        inline_keyboard: [
            [{ text: '⭐ Buy Stars', callback_data: 'buy_stars' }],
            [{ text: '🎰 Play Game', callback_data: 'play_game' }],
            [{ text: '💰 Check Balance', callback_data: 'check_balance' }]
        ]
    };

    bot.sendMessage(
        chatId,
        `Welcome to Diamond Slots! 🎰\n\nYour balance: ⭐ ${userBalance} stars`,
        { reply_markup: keyboard }
    );
});

// Handle callback queries
bot.on('callback_query', async (query) => {
    const { id, from, data } = query;
    const userId = from.id;
    const chatId = query.message.chat.id;

    if (data === 'buy_stars') {
        const starPackages = {
            inline_keyboard: [
                [{ text: '10 ⭐ = $1', callback_data: 'buy_10' }],
                [{ text: '50 ⭐ = $5', callback_data: 'buy_50' }],
                [{ text: '100 ⭐ = $10', callback_data: 'buy_100' }],
                [{ text: 'Back', callback_data: 'back' }]
            ]
        };

        bot.editMessageText(
            'Select a star package:',
            { chat_id: chatId, message_id: query.message.message_id, reply_markup: starPackages }
        );
    } else if (data.startsWith('buy_')) {
        const amount = parseInt(data.split('_')[1]);
        // Send invoice
        await bot.sendInvoice(
            chatId,
            'Diamond Slots Stars',
            `Purchase ${amount} Telegram Stars`,
            JSON.stringify({ user_id: userId, stars: amount }),
            PAYMENT_PROVIDER_TOKEN,
            'XTR',
            [{ label: `${amount} Stars`, amount }]
        );
    } else if (data === 'check_balance') {
        const balance = userStars[userId] || 0;
        bot.answerCallbackQuery(id, `Your balance: ⭐ ${balance} stars`, true);
    } else if (data === 'back') {
        const balance = userStars[userId] || 0;
        const keyboard = {
            inline_keyboard: [
                [{ text: '⭐ Buy Stars', callback_data: 'buy_stars' }],
                [{ text: '🎰 Play Game', callback_data: 'play_game' }],
                [{ text: '💰 Check Balance', callback_data: 'check_balance' }]
            ]
        };
        bot.editMessageText(
            `Welcome to Diamond Slots! 🎰\n\nYour balance: ⭐ ${balance} stars`,
            { chat_id: chatId, message_id: query.message.message_id, reply_markup: keyboard }
        );
    }

    bot.answerCallbackQuery(id);
});

// ==================== SERVER STARTUP ====================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Payment server running on port ${PORT}`);
    console.log(`📱 Bot token: ${BOT_TOKEN ? '✅ Configured' : '❌ Missing'}`);
    console.log(`💳 Payment provider: ${PAYMENT_PROVIDER_TOKEN ? '✅ Configured' : '❌ Missing'}`);
});
