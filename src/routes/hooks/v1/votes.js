const { MessageEmbed } = require("discord.js");
const { Webhook } = require("@infinitybots/client");
const config = require("../../../../config");
const moment = require("moment");

const webhook = new Webhook(`${config.hook_secret}`);

/**
 * FOR AVAILABLE VOTE DATA SEE
 * https://www.npmjs.com/package/@infinitybots/client
 */

module.exports = async (fastify, opts) => {
  fastify.post(
    "/votes",
    webhook.hookListener(async (vote, req, res) => {
      let client = req.client;

      let embed = new MessageEmbed()
        .setTitle(`Vote Logs`)
        .setColor("RANDOM")
        .setDescription(`Woah someone has voted for me on Infinity Bot List`)
        .addFields(
          {
            name: "Total Votes",
            value: `${vote.votes}`,
            inline: true,
          },
          {
            name: "User",
            value: `${vote.userObj.username}#${vote.userObj.discriminator}`,
            inline: true,
          },
          {
            name: "Time",
            value: `${moment(vote.timeStamp)}`,
            inline: true,
          }
        )
        .setTimestamp()
        .setFooter({
          text: "Infinity Vote Logger",
          iconURL: `${vote.userObj.avatar}`,
        });

      await res.status(204).send("Success");

      return client.guilds.cache
        .get(config.guildID)
        .channels.cache.get(config.voteLogs)
        .send({ embeds: [embed] });
    })
  );
};
