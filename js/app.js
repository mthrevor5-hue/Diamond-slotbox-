// Main Application
class DiamondSlotBoxApp {
    constructor() {
        this.currentScreen = null;
        this.player = null;
        this.init();
    }

    async init() {
        // Check network connection
        NetworkManager.init();

        // Initialize storage
        StorageManager.init();

        // Load Telegram Web App
        this.initTelegram();

        // Wait for loading to complete
        await this.showLoadingScreen();

        // Check if user is logged in
        const savedPlayer = StorageManager.getPlayer();
        if (savedPlayer) {
            this.player = savedPlayer;
            this.showMenuScreen();
        } else {
            this.showAuthScreen();
        }
    }

    initTelegram() {
        if (window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp;
            tg.ready();
            tg.expand();
            tg.disableVerticalSwipes();
        }
    }

    showLoadingScreen() {
        return new Promise(resolve => {
            const loadingScreen = document.getElementById('loadingScreen');
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                resolve();
            }, 2000);
        });
    }

    showAuthScreen() {
        this.switchScreen('authScreen');
        this.setupAuthListeners();
    }

    setupAuthListeners() {
        const profileUpload = document.getElementById('profileUpload');
        const profileImg = document.getElementById('profileImg');
        const telegramLoginBtn = document.getElementById('telegramLoginBtn');
        const guestLoginBtn = document.getElementById('guestLoginBtn');
        const usernameInput = document.getElementById('usernameInput');

        profileUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    profileImg.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        telegramLoginBtn.addEventListener('click', () => {
            TelegramAPI.login((userData) => {
                this.createPlayer(userData, profileImg.src);
            });
        });

        guestLoginBtn.addEventListener('click', () => {
            const username = usernameInput.value || 'Guest_' + Math.random().toString(36).substr(2, 9);
            this.createPlayer({ id: Date.now(), first_name: username }, profileImg.src);
        });
    }

    createPlayer(userData, profilePic) {
        this.player = {
            id: userData.id,
            username: userData.first_name || 'Player',
            profilePic: profilePic,
            tickets: 10,
            balance: 0,
            diamonds: 0,
            points: 0,
            premiumPass: false,
            createdAt: new Date().toISOString()
        };

        StorageManager.savePlayer(this.player);
        this.showMenuScreen();
    }

    showMenuScreen() {
        this.switchScreen('menuScreen');
        this.setupMenuListeners();
        this.updatePlayerStats();
    }

    setupMenuListeners() {
        document.getElementById('machine1').addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('leaderboardBtn').addEventListener('click', () => {
            UIManager.showLeaderboard();
        });

        document.getElementById('settingsBtn').addEventListener('click', () => {
            UIManager.showSettings();
        });

        document.getElementById('billingBtn').addEventListener('click', () => {
            UIManager.showBilling();
        });

        document.getElementById('notificationBtn').addEventListener('click', () => {
            UIManager.showNotification();
        });
    }

    startGame() {
        if (this.player.tickets <= 0) {
            UIManager.showBilling();
            return;
        }
        this.switchScreen('gameScreen');
        GameEngine.init(this.player);
        this.setupGameListeners();
    }

    setupGameListeners() {
        document.getElementById('backBtn').addEventListener('click', () => {
            this.showMenuScreen();
        });

        document.getElementById('playBtn').addEventListener('click', () => {
            GameEngine.spin();
        });
    }

    updatePlayerStats() {
        document.getElementById('ticketsDisplay').textContent = this.player.tickets;
        document.getElementById('diamondsDisplay').textContent = this.player.diamonds;
        document.getElementById('balanceDisplay').textContent = this.player.balance.toFixed(2);
        document.getElementById('pointsDisplay').textContent = this.player.points;
    }

    switchScreen(screenId) {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => screen.classList.add('hidden'));
        document.getElementById(screenId).classList.remove('hidden');
        this.currentScreen = screenId;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new DiamondSlotBoxApp();
});