// Game Engine
class GameEngine {
    static player = null;
    static isSpinning = false;
    static autoSpinActive = false;
    static holdTimer = null;

    static init(player) {
        this.player = player;
        this.setupSpinListeners();
    }

    static setupSpinListeners() {
        const playBtn = document.getElementById('playBtn');
        
        playBtn.addEventListener('mousedown', () => {
            this.holdTimer = setTimeout(() => {
                this.autoSpinActive = true;
                this.spin();
            }, 5000);
        });

        playBtn.addEventListener('mouseup', () => {
            clearTimeout(this.holdTimer);
            if (!this.autoSpinActive && !this.isSpinning) {
                this.spin();
            }
        });

        playBtn.addEventListener('click', () => {
            if (this.autoSpinActive) {
                this.autoSpinActive = false;
            }
        });
    }

    static spin() {
        if (this.isSpinning || this.player.tickets <= 0) return;

        this.isSpinning = true;
        this.player.tickets--;
        StorageManager.savePlayer(this.player);
        this.updateGameStats();

        const reel1 = document.getElementById('reel1');
        const reel2 = document.getElementById('reel2');
        const reel3 = document.getElementById('reel3');

        // Random rotation amounts
        const rotation1 = Math.random() * 360 + 1000;
        const rotation2 = Math.random() * 360 + 1200;
        const rotation3 = Math.random() * 360 + 1400;

        reel1.style.transform = `rotateX(${rotation1}deg)`;
        reel2.style.transform = `rotateX(${rotation2}deg)`;
        reel3.style.transform = `rotateX(${rotation3}deg)`;

        setTimeout(() => {
            this.checkWin();
            this.isSpinning = false;
            if (this.autoSpinActive) {
                setTimeout(() => this.spin(), 1000);
            }
        }, 3000);
    }

    static checkWin() {
        const symbols = this.getResultSymbols();
        const [symbol1, symbol2, symbol3] = symbols;

        console.log('Result:', symbols);

        // Check for red diamond (deduct points)
        if (symbol1 === '💎' || symbol2 === '💎' || symbol3 === '💎') {
            const diamondCount = [symbol1, symbol2, symbol3].filter(s => s === '💎').length;
            if (diamondCount === 3) {
                // Jackpot - deduct double
                this.player.diamonds -= 2;
                this.showResult('Red Diamond Jackpot!', '💎💎💎 -2 Diamonds', 'danger');
            } else if (diamondCount > 0) {
                this.player.diamonds -= diamondCount;
                this.showResult('Red Diamond Hit!', `💎 -${diamondCount} Diamonds`, 'danger');
            }
        }

        // Check for money symbols (💰, 💵, 💸)
        const moneySymbols = ['💰', '💵', '💸'];
        const moneyMatches = symbols.filter(s => moneySymbols.includes(s));

        if (moneyMatches.length === 3) {
            this.handleMoneyJackpot();
        } else if (moneyMatches.length > 0) {
            this.handleMoneyWin(symbols);
        }

        // Check for premium symbols (👑, 💌, 🍿)
        const premiumSymbols = ['👑', '💌', '🍿'];
        const premiumMatches = symbols.filter(s => premiumSymbols.includes(s));

        if (premiumMatches.length === 3) {
            this.handlePremiumJackpot();
        } else if (premiumMatches.length > 0) {
            this.handlePremiumWin(symbols);
        }

        // Check for flash (⚡)
        if (symbols.filter(s => s === '⚡').length === 3) {
            this.showResult('Flash Jackpot!', 'Automatic Respin!', 'success');
            setTimeout(() => this.spin(), 1000);
        } else if (symbols.includes('⚡')) {
            this.player.tickets--;
            this.showResult('Flash Hit!', 'Lost 1 Ticket', 'danger');
        }

        StorageManager.savePlayer(this.player);
        this.updateGameStats();
    }

    static handleMoneyJackpot() {
        const jackpot = 6.46 / 3;
        this.player.balance += jackpot * 3;
        this.showResult('💰 MONEY JACKPOT! 💰', `+$${(jackpot * 3).toFixed(2)}`, 'success');
    }

    static handleMoneyWin(symbols) {
        const symbol = symbols[0];
        let win = 0;

        if (symbol === '💸') {
            win = 0.44 * symbols.filter(s => s === '💸').length;
        } else if (symbol === '💵') {
            win = 1.2 * symbols.filter(s => s === '💵').length;
        } else if (symbol === '💰') {
            win = 5 * symbols.filter(s => s === '💰').length;
        }

        this.player.balance += win;
        this.showResult('Money Win!', `+$${win.toFixed(2)}`, 'success');
    }

    static handlePremiumJackpot() {
        const points = 3000 / 3;
        this.player.points += points * 3;
        this.showResult('👑 PREMIUM JACKPOT! 👑', `+${(points * 3).toFixed(0)} Points`, 'success');
    }

    static handlePremiumWin(symbols) {
        const symbol = symbols[0];
        let win = 0;

        if (symbol === '👑') {
            win = 1500 * symbols.filter(s => s === '👑').length;
        } else if (symbol === '💌') {
            win = 500 * symbols.filter(s => s === '💌').length;
        } else if (symbol === '🍿') {
            win = 1000 * symbols.filter(s => s === '🍿').length;
        }

        this.player.points += win;
        this.showResult('Premium Win!', `+${win} Points`, 'success');
    }

    static getResultSymbols() {
        const symbols = ['💎', '🍿', '💰', '⚡', '👑', '🏆', '🫩', '💌'];
        return [
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)]
        ];
    }

    static showResult(title, amount, type = 'info') {
        const resultDisplay = document.getElementById('resultDisplay');
        const resultText = document.getElementById('resultText');
        const resultAmount = document.getElementById('resultAmount');

        resultText.textContent = title;
        resultAmount.textContent = amount;
        resultDisplay.className = 'result-display';
        resultDisplay.classList.add(type);
        resultDisplay.classList.remove('hidden');

        setTimeout(() => {
            resultDisplay.classList.add('hidden');
        }, 2000);
    }

    static updateGameStats() {
        document.getElementById('gameTickets').textContent = this.player.tickets;
        document.getElementById('gameBalance').textContent = this.player.balance.toFixed(2);
        document.getElementById('gamePoints').textContent = this.player.points;
    }
}
