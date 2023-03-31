# Webhook Server Sample
Simple Fastify Server for logging our Vote Webhooks

---

## Setup

### Step 1
- Open and edit the config.js file using the table below as a reference!

| Value            | Description                        | Example                                 |
| :---             |                           :----:   |                                    ---: |
| `hook_secret`    | Your webhook secret                | `InfinityBotsTest_2022`                 |
| `bot_token`      | Discord Client Token               | `Found in the Discord Dev Portal`       |
| `domain`         | The domain for the Server          | `https://votes.infinitybots.gg`         |
| `guildID`        | Discord Server ID for Logs         | `758641373074423808`                    |
| `voteLogs`       | Channel ID in the Server Above     | `https://votes.infinitybots.gg`         |
| `port`           | The port the Server will run on    | `4223`                                  |

> NOTE: If you are using `railway`, or `heroku` for hosting the port should be set to `process.env.PORT` to allow them to dynamically assign ports. You should set this on line 38 of the `src/sever/index.js` file!  

**NOTE:** Webhook Secret should also be set in the settings/edit section for your bot on our website (shown below)

**NOTE:** Webhook URL shown below should be 
- `https://yourdomain.com/hooks/v1/votes/` for v1 webhooks
- `https://yourdomain.com/hooks/v2/votes` for v2 webhooks


![Imgur](https://i.imgur.com/QBHiQVC.png)

### Step 2 
Run the server using the following

- `npm install` - Install required modules
- `npm start` - for production startup
- `npm run dev` - for development startup

---

## Deployment

### Heroku
<a href="https://dashboard.heroku.com/new?template=https://github.com/InfinityBotList/Webhook-Server/tree/master">
  <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy">
</a>

### Railway
<a href="https://railway.app/template/wZBSMc?referralCode=ca8amY">
  <img src="https://railway.app/button.svg" alt="Deploy">
</a>
