const fs = require('fs');
const path = require('path');
const colors = require('colors');

class ModuleHandler {
    constructor(client) {
        this.client = client;
        this.modules = new Map();
        this.modulePath = path.join(process.cwd(), 'modules');
    }

    loadModules() {
        if (!fs.existsSync(this.modulePath)) {
            fs.mkdirSync(this.modulePath);
            fs.mkdirSync(path.join(this.modulePath, 'core'));
        }

        const moduleFolders = fs.readdirSync(this.modulePath);

        for (const folder of moduleFolders) {
            try {
                const moduleConfig = require(path.join(this.modulePath, folder, 'module.json'));
                if (moduleConfig.enabled) {
                    const module = require(path.join(this.modulePath, folder, 'index.js'));
                    module.init(this.client, this.client.commands);
                    this.modules.set(moduleConfig.name, {
                        config: moduleConfig,
                        instance: module
                    });
                    console.log("[System]:".green, `Loaded module: ${moduleConfig.name}`);
                }
            } catch (error) {
                console.log("[System]:".red, `Failed to load module ${folder}:`, error);
            }
        }
    }

    getModules() {
        return this.modules;
    }
}

module.exports = ModuleHandler;