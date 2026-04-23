// Billing Manager
class BillingManager {
    static PACKAGES = [
        { tickets: 10, price: 0.66, stars: 21, id: 'pkg_10_tickets' },
        { tickets: 19, price: 1.50, stars: 43, id: 'pkg_19_tickets' },
        { tickets: 40, price: 3.00, stars: 60, id: 'pkg_40_tickets' },
        { premium: true, price: 20, stars: 1000, id: 'pkg_premium' }
    ];

    static async purchasePackage(packageId, paymentMethod = 'stars') {
        const pkg = this.PACKAGES.find(p => p.id === packageId);
        if (!pkg) return false;

        if (paymentMethod === 'stars') {
            return await TelegramAPI.processStarPayment(pkg.stars, () => {
                this.applyPurchase(pkg);
            });
        }
        return false;
    }

    static applyPurchase(pkg) {
        const player = StorageManager.getPlayer();
        
        if (pkg.premium) {
            player.premiumPass = true;
        } else {
            player.tickets += pkg.tickets;
        }
        
        StorageManager.savePlayer(player);
    }
}
