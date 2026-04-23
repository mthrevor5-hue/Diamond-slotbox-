// Storage Manager
class StorageManager {
    static DB_NAME = 'DiamondSlotBox';
    static PLAYER_KEY = 'player_data';
    static LEADERBOARD_KEY = 'leaderboard_data';

    static init() {
        // Initialize storage with IndexedDB support
        if (!this.getPlayer()) {
            this.createDefaultData();
        }
    }

    static createDefaultData() {
        // Initialize with empty data
        localStorage.setItem(this.LEADERBOARD_KEY, JSON.stringify([]));
    }

    static savePlayer(player) {
        localStorage.setItem(this.PLAYER_KEY, JSON.stringify(player));
    }

    static getPlayer() {
        const data = localStorage.getItem(this.PLAYER_KEY);
        return data ? JSON.parse(data) : null;
    }

    static updateLeaderboard(player) {
        let leaderboard = this.getLeaderboard();
        const existingIndex = leaderboard.findIndex(p => p.id === player.id);

        if (existingIndex >= 0) {
            leaderboard[existingIndex] = player;
        } else {
            leaderboard.push(player);
        }

        // Sort by points
        leaderboard.sort((a, b) => b.points - a.points);

        // Keep only top 100
        leaderboard = leaderboard.slice(0, 100);
        localStorage.setItem(this.LEADERBOARD_KEY, JSON.stringify(leaderboard));
    }

    static getLeaderboard() {
        const data = localStorage.getItem(this.LEADERBOARD_KEY);
        return data ? JSON.parse(data) : [];
    }

    static deletePlayer() {
        localStorage.removeItem(this.PLAYER_KEY);
    }

    static clearAllData() {
        localStorage.clear();
    }
}
