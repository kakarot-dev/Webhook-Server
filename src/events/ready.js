const WebhookServer = require("../server/index");

module.exports = async (client) => {
  await WebhookServer(client);

  return console.log(`${client.user.username} and Web Server are online.`);
};
