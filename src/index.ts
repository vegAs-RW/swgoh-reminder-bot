import { Client, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
import { scheduleTBReminders } from "./tbReminder";

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

client.once('ready', () => {
    console.log(`Bot connecté en tant que ${client.user?.tag}`);
    scheduleTBReminders(client)
})

client.login(process.env.DISCORD_TOKEN)
