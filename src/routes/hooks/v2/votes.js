const { MessageEmbed } = require("discord.js");
const { Reedhook } = require("@infinitybots/client");
const moment = require("moment");

const webhook = new Reedhook(process.env.HOOK_SECRET);

/**
 * FOR AVAILABLE VOTE DATA SEE
 * https://www.npmjs.com/package/@infinitybots/client
 */

module.exports = async (fastify, opts) => {
  fastify.post(
    "/votes",
    webhook.hookListener(async (voteData, req, res) => {
      let client = req.client;

      console.log(voteData);

      let embed = new MessageEmbed()
        .setTitle(`Vote Logs`)
        .setColor("RANDOM")
        .setDescription(`Woah someone has voted for me on Infinity Bot List`)
        .addFields(
          {
            name: "Total Votes",
            value: `${voteData.data.votes}`,
            inline: true,
          },
          {
            name: "User",
            value: `${voteData.creator.username}#${voteData.creator.discriminator}`,
            inline: true,
          },
          {
            name: "Time",
            value: `${moment(voteData.created_at)}`,
            inline: true,
          }
        )
        .setTimestamp()
        .setFooter({
          text: "Infinity Vote Logger",
          iconURL: `${voteData.creator.avatar}`,
        });

      await client.guilds.cache
        .get(process.env.GUILD_ID)
        .channels.cache.get(process.env.VOTE_LOGS)
        .send({ embeds: [embed] });

      return res.status(204).send("");
    })
  );
};
