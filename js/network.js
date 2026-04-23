// Network Manager
class NetworkManager {
    static isOnline = navigator.onLine;
    static alertShown = false;

    static init() {
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
    }

    static handleOnline() {
        this.isOnline = true;
        this.hideAlert();
    }

    static handleOffline() {
        this.isOnline = false;
        this.showAlert();
    }

    static showAlert() {
        if (!this.alertShown) {
            const alert = document.getElementById('networkAlert');
            alert.classList.remove('hidden');
            this.alertShown = true;
        }
    }

    static hideAlert() {
        const alert = document.getElementById('networkAlert');
        alert.classList.add('hidden');
        this.alertShown = false;
    }

    static async checkConnection() {
        try {
            const response = await fetch('https://www.google.com/favicon.ico', { method: 'HEAD', no_cors: true });
            return response.ok || response.type === 'opaque';
        } catch {
            return false;
        }
    }
}
