# Scarcity farming bot for telegram

The purpose of this bot is to farm xp and resource for scarcity.game.

## Installation

Must have node.js installed.

1. Clone repository.
2. Install yarn.

```bash
 npm install --global yarn
```

2. Install depencencies by running

```bash
yarn
```

3. Rename .env.example to .env and set up.

```bash
PRIVATE_KEY=123QWE
ALCHEMY_POLYGON_API_KEY=456RTY
BOT_TOKEN=123:qwe
CRAFTER_ID=424
```

-   PRIVATE_KEY is your Polygon wallet private key. [How to export private keys](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key).
-   ALCHEMY_POLYGON_API_KEY – get [here](https://www.alchemy.com/) for Polygon network.
-   BOT_TOKEN is your telegram bot token. [@BotFather](https://stackoverflow.com/a/48109513).
-   CRAFTER_ID is your any scarcity adventurer id.

4. Start your bot.

```bash
node bot.js
```

5. Type `/count` to your bot.

## Usage

1. `/count` command will count you total adventurers and write it to adventurer-id.json file. Run again to re-count.
2. `/xpquest` command will send all eligible adventurers to farm XP.
3. `/materialssend` will send all eligible adventurers to farm materials for crafting.
4. `/materialstransfer` will send all gathered materials to crafter id from your .env file.

-   Do not share your bot to anyone.

## Heroku

See Procfile. Bot is ready to be deployed to Heroku. [Learn how to](https://shiffman.net/a2z/bot-heroku/).
