import { Client, TextChannel } from "discord.js";
import schedule from "node-schedule";
import fs from "fs"
import path from "path";


interface TBEvent {
    name: string;
    start: string;
    phases: number;
    channelId: string;
    roleId: string;
}

export function scheduleTBReminders(client: Client) {
    const dataPath = path.join(__dirname, 'data', 'territoryBattles.json');
    const raw = fs.readFileSync(dataPath, 'utf-8');
    const events: TBEvent[] = JSON.parse(raw);

    for (const event of events) {
        const start = new Date(event.start);
    
        for (let i=0; i < event.phases; i++) {
            const phaseStart = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
            const phaseEnd = new Date(phaseStart.getTime() + 24 * 60 * 60 * 1000);
            const channel = client.channels.cache.get(event.channelId) as TextChannel;

            schedule.scheduleJob(phaseStart, () => {
                
                if (channel) {
                    channel.send({
                        content: `<@&${event.roleId}> **${event.name}** - Début de la phase ${i + 1} ! Pensez à vos assignations et au déploiement !`,
                        allowedMentions: {parse: ['roles']},
                    });
                }
            });

            const OneHoureBeforeEnd = new Date(phaseEnd.getTime() - 60 * 60 * 1000);
            schedule.scheduleJob(OneHoureBeforeEnd, () => {
                if (channel) {
                    channel.send({
                        content: `<@&${event.roleId}> **${event.name}** - Il reste **1h** pour vos déploiements !`,
                        allowedMentions: {parse: ['roles']},
                    })
                }
            })
        }
    }
}