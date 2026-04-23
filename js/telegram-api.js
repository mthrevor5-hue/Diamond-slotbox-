// Telegram API Integration
class TelegramAPI {
    static CLIENT_ID = '8366149718';
    static CLIENT_SECRET = 'nMMnd4XKxOfK_-LK4e3YlQ9eFNWqDSzvwRAoMGi0BqHhxJItZPg4pQ';

    static login(callback) {
        if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
            const user = window.Telegram.WebApp.initDataUnsafe.user;
            callback(user);
        } else {
            // Fallback for development
            alert('Please open this app through Telegram');
        }
    }

    static async processStarPayment(stars, onSuccess) {
        if (window.Telegram?.WebApp?.sendData) {
            const paymentData = {
                action: 'payment',
                currency: 'XTR',
                total_amount: stars
            };
            
            window.Telegram.WebApp.sendData(JSON.stringify(paymentData));
            
            // Simulate payment success
            setTimeout(() => {
                onSuccess();
            }, 1000);
        } else {
            // Fallback for testing
            onSuccess();
        }
        return true;
    }

    static sendNotification(message) {
        if (window.Telegram?.WebApp?.showAlert) {
            window.Telegram.WebApp.showAlert(message);
        }
    }

    static vibrate() {
        if (window.Telegram?.WebApp?.HapticFeedback?.impactOccurred) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        } else if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }

    static async sendBotMessage(message) {
        // This would be implemented on the bot backend
        console.log('Sending to bot:', message);
    }
}
