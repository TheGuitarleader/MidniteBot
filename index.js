const fs = require('fs');
const Discord = require('discord.js');
const Client = require('./client/client');
const config = require('./config.json');
const package = require('./package.json');
const EventEmitter = require('events');
const Twit = require('twit');
const Twitch = require('twitch-api-v5');
const bot = new EventEmitter();

const client = new Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

var liveMessage = false;

//console.log(client.commands);
client.login(config.discord.token)

client.once('connecting', () => {
	console.log('Connecting to Discord...');
});

client.once('disconnect', () => {
	console.log('Disconnected from Discord');
});

client.once('ready', () => {
    console.log('Connected to Discord');
    client.user.setActivity('v' + package.version, {type: 'PLAYING'});
    bot.emit('start');
});

client.on('message', async message => {
    if(message.author.bot) return;
    if(!message.content.startsWith(config.discord.prefix)) return;

    const args = message.content.slice(config.discord.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);

    try{
        command.execute(message, client);
    } catch (err) {
        console.error(err);
        message.reply('Error with command: ' + message.content);
    }
});

// Twitter
var Twitter = new Twit({
    consumer_key: config.twitter.api_key,
    consumer_secret: config.twitter.api_key_secret,
    access_token: config.twitter.access_token,
    access_token_secret: config.twitter.access_token_secret
});

bot.on('start', function (data) {
    twitterReady = true;
    // var stream = Twitter.stream('statuses/filter', { follow: config.twitter.account_ID });

    // stream.on('connect', function (request) {
    //     console.log('Connecting to Twitter...');
    //     client.user.setStatus('idle');
    // });

    // stream.on('connected', function (response) {
    //     console.log('Connected to Twitter');
    // });

    // stream.on('disconnected', function (disconnectMessage) {
    //     console.log('Disconnected from Twitter');
    //     client.user.setStatus('dnd');
    //     sleep(2000);
    //     stream.start();
    // });

    // stream.on('tweet', function (tweet) {
    //     if(!tweet.text.startsWith('RT'))
    //     {
    //         if(userIds.includes(tweet.user.id))
    //         {
    //             const embedMessage = new Discord.MessageEmbed()
    //             .setColor(config.discord.embed_color)
    //             .setAuthor(tweet.user.name + ' (@' + tweet.user.screen_name + ')', tweet.user.profile_image_url, 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str)
    //             .setDescription(tweet.text)
    //             .addField("Following", tweet.user.friends_count, true)
    //             .addField("Followers", tweet.user.followers_count, true)
    //             .setFooter('From Twitter')
            
    //             console.log(`Forwarding tweet from ${tweet.user.screen_name} to Discord ->`);
    //             client.channels.cache.get(config.discord.tweet_ch).send(embedMessage);
    //         }
    //     }
    // });
});

var checkTwitchLive = setInterval(function() {
    twitchReady = true;
    
    var time = require('moment');
    var currentTime = time().format('HH:mm:ss');
    console.log(currentTime + ' Checking...')

    Twitch.clientID = config.twitch.client_id;
    Twitch.streams.channel({channelID: config.twitch.channel_ID, stream_type: 'live'}, (err, res) => {
        if(!err){
          if(res.stream != null && liveMessage == false) {
            client.user.setActivity(res.stream.channel.game, {type: 'STREAMING', url: `https://twitch.tv/${res.stream.channel.display_name}`});

            const embed = new Discord.MessageEmbed()
            .setColor('#9146FF')
            .setAuthor(res.stream.channel.display_name, res.stream.channel.logo)
            .setTitle(res.stream.channel.status)
            .setURL(`https://twitch.tv/${res.stream.channel.display_name}`)
            .addField('Game', res.stream.channel.game, true)
            .addField('Followers', res.stream.channel.followers, true)
            .setImage(res.stream.preview.large)
            client.channels.cache.get(config.discord.live_ch).send(embed);
            liveMessage = true;

          } else if(res.stream == null) {
              client.user.setActivity('v' + package.version, {type: 'PLAYING'});
              liveMessage = false;
          }
        };
    });
}, 60000);