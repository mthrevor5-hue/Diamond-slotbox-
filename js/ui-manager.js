// UI Manager
class UIManager {
    static showLeaderboard() {
        const modal = document.getElementById('leaderboardModal');
        modal.classList.remove('hidden');
        this.populateLeaderboard();
        this.startCountdown();

        document.getElementById('leaderboardClose').addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }

    static populateLeaderboard() {
        const leaderboard = StorageManager.getLeaderboard();
        const list = document.getElementById('leaderboardList');
        list.innerHTML = '';

        const medals = ['🥇', '🥈', '🥉', '🏅'];

        leaderboard.slice(0, 10).forEach((player, index) => {
            const medal = index < 3 ? medals[index] : '🏅';
            const reward = index === 0 ? '5 🎟️' : index === 1 ? '3 🎟️' : index === 2 ? '2 🎟️' : '7/7 🎟️';

            const item = document.createElement('div');
            item.className = 'leaderboard-item';
            item.innerHTML = `
                <div class="rank-badge">${medal}</div>
                <div class="player-info">
                    <div class="player-name">${player.username}</div>
                    <div class="player-points">🎖️ ${player.points}</div>
                </div>
                <div class="reward-badge">${reward}</div>
            `;
            list.appendChild(item);
        });
    }

    static startCountdown() {
        const timer = document.getElementById('countdownTimer');
        let days = 7;

        const updateTimer = () => {
            timer.textContent = `${days}d`;
            days--;
            if (days < 0) {
                days = 7;
            }
        };

        updateTimer();
        setInterval(updateTimer, 86400000); // Update every 24 hours
    }

    static showBilling() {
        const modal = document.getElementById('billingModal');
        modal.classList.remove('hidden');
        this.setupBillingListeners();

        document.getElementById('billingClose').addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        document.getElementById('billingExit').addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }

    static setupBillingListeners() {
        const buyButtons = document.querySelectorAll('.btn-buy');
        buyButtons.forEach(btn => {
            btn.removeEventListener('click', this.handleBuyClick);
            btn.addEventListener('click', (e) => this.handleBuyClick(e));
        });
    }

    static handleBuyClick(e) {
        const pkg = e.target.closest('.package');
        const tickets = pkg.dataset.tickets;
        const price = pkg.dataset.price;
        const isPremium = pkg.dataset.premium === 'true';

        if (isPremium) {
            TelegramAPI.processStarPayment(1000, () => {
                const player = StorageManager.getPlayer();
                player.premiumPass = true;
                StorageManager.savePlayer(player);
                alert('Premium Pass activated!');
                document.getElementById('billingModal').classList.add('hidden');
            });
        } else {
            TelegramAPI.processStarPayment(parseInt(price), () => {
                const player = StorageManager.getPlayer();
                player.tickets += parseInt(tickets);
                StorageManager.savePlayer(player);
                alert(`Purchased ${tickets} tickets!`);
                document.getElementById('billingModal').classList.add('hidden');
            });
        }
    }

    static showSettings() {
        const modal = document.getElementById('settingsModal');
        modal.classList.remove('hidden');
        this.setupSettingsListeners();

        document.getElementById('settingsClose').addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }

    static setupSettingsListeners() {
        const deleteBtn = document.getElementById('deleteAccountBtn');
        const telegramChannelInput = document.getElementById('telegramChannel');

        deleteBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
                StorageManager.deletePlayer();
                location.reload();
            }
        });

        // Load saved telegram channel
        const saved = localStorage.getItem('telegramChannel');
        if (saved) telegramChannelInput.value = saved;

        telegramChannelInput.addEventListener('change', () => {
            localStorage.setItem('telegramChannel', telegramChannelInput.value);
        });
    }

    static showNotification() {
        const notifBox = document.getElementById('notificationBox');
        notifBox.classList.remove('hidden');

        document.getElementById('claimTicketBtn').addEventListener('click', () => {
            const player = StorageManager.getPlayer();
            player.tickets += 1;
            StorageManager.savePlayer(player);
            notifBox.classList.add('hidden');
            alert('Claimed 1 free ticket!');
        });

        // Auto-hide after 10 seconds
        setTimeout(() => {
            notifBox.classList.add('hidden');
        }, 10000);
    }
}
