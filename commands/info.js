const Discord = require('discord.js');
const package = require('../package.json');
const config = require('../config.json');

module.exports = {
    name: "info",
    description: "Gives the user more information about the bot",
    async execute(message) {

        // var user = client.user.username;
        // console.log(user);

        const embed = new Discord.MessageEmbed()
        .setColor(config.discord.embed_color)
        .setAuthor(message.client.user.username, message.client.user.displayAvatarURL())
        .setDescription(`${message.client.user.username} v${package.version}\nMade by Kyle (TheGuitarleader)\n\n` + 
            `Built on:\nDiscord.js v${package.dependencies["discord.js"].replace("^","")}\n` + 
            `Twit v${package.dependencies.twit.replace("^","")}\n` + 
            `Twitch-bot v${package.dependencies["twitch-bot"].replace("^","")}\n` + 
            `Twitch-api-v5 v${package.dependencies["twitch-api-v5"].replace("^","")}`)
        .setFooter('Made with KaiBot Technology')

        message.reply(embed);
    }
}