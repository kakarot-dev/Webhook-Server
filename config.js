/**
 * CONFIG FILE FOR WEBHOOK SERVER
 * @default bot_token Your Discord Bot Token found at https://discord.com/developers/applications/{BOT_ID}/bot
 * @default domain The domain to use for the webserver (Ex: vots.infinitybots.gg)
 * @default guildID The Guild ID to send logs to when someone votes for your bot
 * @default voteLogs The Channel ID to send logs to when someone votes for your bot (channel should exist in the guild listed with `guildID`)
 * @default port The port for the webserver to run on
 */

module.exports = {
    hook_secret: "MigiziBot_123",
    bot_token: "OTk3MzkwOTQzMDk3NDU0Njg0.G7u8Mu.vjHKPqWdeybjbupNgCXdvh_KB7-Wy2grv2GiCE",
    domain: "https://ibl-test-server.herokuapp.com/",
    guildID: "998713528624087090",
    voteLogs: "998714340326781049",
    port: process.env.PORT
}