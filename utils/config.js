const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

class Config {
    constructor() {
        this.config = null;
        this.load();
    }

    load() {
        try {
            const configPath = path.join(__dirname, '../config.yml');
            const fileContents = fs.readFileSync(configPath, 'utf8');
            this.config = yaml.load(fileContents);
        } catch (error) {
            console.error('Error loading config:', error);
            process.exit(1);
        }
    }

    get(path) {
        return path.split('.').reduce((obj, key) => obj?.[key], this.config);
    }

    reload() {
        this.load();
        return this.config;
    }
}

module.exports = new Config();
