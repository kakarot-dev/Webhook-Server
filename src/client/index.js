const dotenv = require("dotenv");
dotenv.config();
const { Client, Intents } = require("discord.js");
const evt = require("./events");
const client = new Client({
  shards: "auto",
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
  allowedMentions: {
    parse: ["roles", "users"],
    repliedUser: false,
  },
  partials: ["CHANNEL", "GUILD_MEMBER", "USER"],
});

module.exports = client;

evt(client);

client.login(process.env.BOT_TOKEN);
