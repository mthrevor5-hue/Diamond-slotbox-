// Settings Manager
class SettingsManager {
    static SETTINGS_KEY = 'app_settings';

    static getSettings() {
        const settings = localStorage.getItem(this.SETTINGS_KEY);
        return settings ? JSON.parse(settings) : this.getDefaultSettings();
    }

    static getDefaultSettings() {
        return {
            soundEnabled: true,
            vibrationEnabled: true,
            notificationsEnabled: true,
            telegramChannel: '',
            version: '1.0.0'
        };
    }

    static saveSettings(settings) {
        localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    }

    static toggleSound() {
        const settings = this.getSettings();
        settings.soundEnabled = !settings.soundEnabled;
        this.saveSettings(settings);
        return settings.soundEnabled;
    }

    static toggleVibration() {
        const settings = this.getSettings();
        settings.vibrationEnabled = !settings.vibrationEnabled;
        this.saveSettings(settings);
        return settings.vibrationEnabled;
    }

    static toggleNotifications() {
        const settings = this.getSettings();
        settings.notificationsEnabled = !settings.notificationsEnabled;
        this.saveSettings(settings);
        return settings.notificationsEnabled;
    }
}
