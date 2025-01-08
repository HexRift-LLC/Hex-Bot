const yaml = require('js-yaml');
const fs = require('fs');
const colors = require('colors');

class ConfigManager {
    constructor() {
        this.config = null;
        this.load();
    }

    load() {
        try {
            this.config = yaml.load(fs.readFileSync('config.yml', 'utf8'));
            console.log("[System]:".green, "Configuration loaded successfully");
        } catch (error) {
            console.log("[System]:".red, "Failed to load configuration:", error);
            process.exit(1);
        }
    }

    get(path) {
        return path.split('.').reduce((obj, key) => obj?.[key], this.config);
    }

    getAll() {
        return this.config;
    }
}

module.exports = ConfigManager;