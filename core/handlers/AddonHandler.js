const fs = require('fs');
const path = require('path');
const colors = require('colors');

class AddonHandler {
    constructor(client) {
        this.client = client;
        this.addons = new Map();
        this.addonPath = path.join(process.cwd(), 'addons');
    }

    loadAddons() {
        if (!fs.existsSync(this.addonPath)) {
            fs.mkdirSync(this.addonPath);
        }

        const addonFolders = fs.readdirSync(this.addonPath)
            .filter(file => !file.startsWith('core'));

        for (const folder of addonFolders) {
            try {
                const addonConfig = require(path.join(this.addonPath, folder, 'addon.json'));
                if (addonConfig.enabled) {
                    const addon = require(path.join(this.addonPath, folder, 'index.js'));
                    // Pass both client and commands collection
                    addon.init(this.client, this.client.commands);
                    this.addons.set(addonConfig.name, {
                        config: addonConfig,
                        instance: addon
                    });
                    console.log("[System]:".green, `Loaded addon: ${addonConfig.name}`);
                }
            } catch (error) {
                console.log("[System]:".red, `Failed to load addon ${folder}:`, error);
            }
        }
    }

    getAddons() {
        return this.addons;
    }
}

module.exports = AddonHandler;