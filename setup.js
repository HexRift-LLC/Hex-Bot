const { execSync } = require('child_process');
const fs = require('fs');

// Install colors first
if (!fs.existsSync('node_modules/colors')) {
    console.log('\nInstalling colors package...\n');
    try {
        execSync('npm install colors', { stdio: 'inherit' });
    } catch (error) {
        console.error('Failed to install colors package');
        process.exit(1);
    }
}

const colors = require('colors');

// Then install remaining dependencies
if (!fs.existsSync('node_modules')) {
    console.log('[Installer]:'.cyan, 'Installing required dependencies...\n');
    try {
        execSync('npm install', { stdio: 'inherit' });
        console.log('[Installer]:'.green, 'Dependencies installed successfully!\n');
    } catch (error) {
        console.log('[Installer]:'.red, 'Failed to install dependencies. Please run npm install manually.\n');
        process.exit(1);
    }
}

const inquirer = require('inquirer');
const yaml = require('js-yaml');
const chalk = require('chalk');
const figlet = require('figlet');

async function displayWelcome() {
    console.clear();
    console.log('\n');
    console.log(chalk.cyan(figlet.textSync('Hex Bot', {
        font: 'Big',
        horizontalLayout: 'full'
    })));
    console.log('\n');
    console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.log(chalk.white.bold('                Welcome to Hex Bot Wizard'));
    console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
}

async function setupWizard() {
    try {
        await displayWelcome();
        
        // Bot Configuration
        console.log("[Wizard]:".cyan, `Bot Configuration\n`);
        const botConfig = await inquirer.prompt([
            {
                type: 'input',
                name: 'token',
                message: console.log("[System]:".blue, `Discord Bot Token:`),
                validate: input => input.length > 0 ? true : 'Token is required'
            },
            {
                type: 'input',
                name: 'clientId',
                message: console.log("[System]:".blue, `Bot Client ID:`),
                validate: input => input.length > 0 ? true : 'Client ID is required'
            }
        ]);

        // System Configuration
        console.log("[Wizard]:".cyan, `System Configuration\n`);
        const systemConfig = await inquirer.prompt([
            {
                type: 'number',
                name: 'port',
                message: console.log("[System]:".blue, `Port number:`),
                default: 3000
            },
            {
                type: 'input',
                name: 'ownerID',
                message: console.log("[System]:".blue, `Bot Owner ID:`),
                validate: input => input.length > 0 ? true : 'Owner ID is required'
            }
        ]);

        // Embed Configuration
        console.log("[Wizard]:".cyan, `Embed Configuration\n`);
        const embedConfig = await inquirer.prompt([
            {
                type: 'input',
                name: 'embedColor',
                message: console.log("[System]:".blue, `Default Embed Color (hex):`),
                default: '#ff0000',
                validate: input => /^#[0-9A-F]{6}$/i.test(input) ? true : 'Please enter a valid hex color (e.g. #ff0000)'
            },
            {
                type: 'input',
                name: 'footerText',
                message: console.log("[System]:".blue, `Default Embed Footer Text:`),
                default: 'Powered by Hex Bot'
            },
            {
                type: 'input',
                name: 'footerIcon',
                message: console.log("[System]:".blue, `Footer Icon URL (optional):`),
                default: ''
            }
        ]);

        // Create Configuration Object
        const config = {
            Bot: botConfig,
            System: {
                ...systemConfig,
                version: "1.0.0",
                startTime: new Date().toISOString()
            },
            Embed: embedConfig,
            Logs: {
                enabled: true,
                channelId: null
            }
        };

        // Create Directory Structure
        const directories = ['commands', 'events', 'addons', 'core'];
        directories.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
                console.log("[System]:".green, `Created ${dir} directory`);
            }
        });

        // Save Configuration
        console.log("[System]:".yellow, `Saving configuration...`);
        fs.writeFileSync('config.yml', yaml.dump(config));
        console.log("[System]:".green, `Configuration saved successfully!`);
        console.log("[System]:".green, `Setup complete! Hex Bot is ready to go.`);
        console.log("[System]:".cyan, `Start Hex Bot with: npm start\n`);

    } catch (error) {
        console.log("[System]:".red, `Error during setup:`, error);
        process.exit(1);
    }
}

// Run Setup
if (!fs.existsSync('config.yml')) {
    setupWizard();
} else {
    console.log("[System]:".red, `Configuration file already exists. Delete config.yml to run setup again.`);
}