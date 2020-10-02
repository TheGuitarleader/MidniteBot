const Discord = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: "ping",
    description: "Checks the status of the bot",
    async execute(message) {
        message.channel.send("Pinging...").then(msg =>{
            var botping = Math.round(message.client.ws.ping);
            var ping = msg.createdTimestamp - message.createdTimestamp;

            var embed = new Discord.MessageEmbed()
            .setDescription(":hourglass_flowing_sand: " + ping + "ms\n\n:stopwatch: " + botping + "ms")
            .setColor(config.discord.embed_color)
            
            msg.delete();
            message.channel.send(embed);
      });
    }
}