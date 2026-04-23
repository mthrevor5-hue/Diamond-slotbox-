// Leaderboard Manager
class LeaderboardManager {
    static updateLeaderboard() {
        const player = StorageManager.getPlayer();
        StorageManager.updateLeaderboard(player);
    }

    static getTopPlayers(limit = 10) {
        return StorageManager.getLeaderboard().slice(0, limit);
    }

    static getPlayerRank() {
        const player = StorageManager.getPlayer();
        const leaderboard = StorageManager.getLeaderboard();
        return leaderboard.findIndex(p => p.id === player.id) + 1;
    }

    static resetWeeklyLeaderboard() {
        // Reset on every Monday
        const today = new Date();
        const dayOfWeek = today.getDay();
        
        if (dayOfWeek === 1) { // Monday
            const leaderboard = StorageManager.getLeaderboard();
            leaderboard.forEach(player => {
                player.points = 0;
            });
            localStorage.setItem(StorageManager.LEADERBOARD_KEY, JSON.stringify(leaderboard));
        }
    }
}
