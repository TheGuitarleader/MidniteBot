const Discord = require('discord.js');
const fs = require('fs');
const package = require('../package.json');
const config = require('../config.json');

module.exports = {
    name: "changelog",
    description: "Sends a embed telling the user whats changed",
    async execute(message) {
        var changelog = await readChangelog('./changelog.txt');
        
        const embed = new Discord.MessageEmbed()
        .setColor(config.discord.embed_color)
        .setTitle(`What's new with ${message.client.user.username} v${package.version}?`)
        .setDescription(changelog)

        message.reply(embed);
    }
}

async function readChangelog(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', function (err, data) {
            if(err){
                reject(err);
            }
            resolve(data);
        });
    });
}