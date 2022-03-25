require("dotenv").config(); //initialize dotenv
const Discord = require("discord.js"); //import discord.js
const { Client, Intents } = require("discord.js");
const client = new Discord.Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
}); //create new client

const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, guildId, token } = require("./config.json");

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!"),
  new SlashCommandBuilder()
    .setName("server")
    .setDescription("Replies with server info!"),
  new SlashCommandBuilder()
    .setName("user")
    .setDescription("Replies with user info!"),
].map((command) => command.toJSON());

const rest = new REST({ version: "9" }).setToken(token);

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
client.on("message", (msg) => {
  if (msg.content === "ping") {
    msg.reply("xupamos!");
  }
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		await interaction.reply('Pong!');
	} else if (commandName === 'server') {
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	} else if (commandName === 'user') {
		await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
	}
});
client.on('messageDelete', async message => {
	console.log(`A message by ${message.author.tag} was deleted, but we don't know by who yet.`);
    client.channels.cache.get(message.channelId).send(`A message by ${message.author.tag} was deleted, but we don't know by who yet.`)
    //await message.reply(`A message by ${message.author.tag} was deleted, but we don't know by who yet.`)
});
client.on('guildMemberRemove', member => {
    console.log("did it?")
	console.log(`${member.user.tag} left the guild... but was it of their own free will?`);
});

client.on('guildMemberRemove', async member => {
    console.log("did it?")
	const fetchedLogs = await member.guild.fetchAuditLogs({
		limit: 1,
		type: 'MEMBER_KICK',
	});
	// Since there's only 1 audit log entry in this collection, grab the first one
	const kickLog = fetchedLogs.entries.first();

	// Perform a coherence check to make sure that there's *something*
	if (!kickLog) return console.log(`${member.user.tag} left the guild, most likely of their own will.`);

	// Now grab the user object of the person who kicked the member
	// Also grab the target of this action to double-check things
	const { executor, target } = kickLog;

	// Update the output with a bit more information
	// Also run a check to make sure that the log returned was for the same kicked member
	if (target.id === member.id) {
		console.log(`${member.user.tag} left the guild; kicked by ${executor.tag}?`);
	} else {
		console.log(`${member.user.tag} left the guild, audit log fetch was inconclusive.`);
	}
});
//make sure this line is the last line
client.login("OTU2NjU0MzAwNjI3NTk5Mzgx.YjzXvw.CCcF83mq3vrk1LfJkyI6BDN_Y2Q"); //login bot using token
