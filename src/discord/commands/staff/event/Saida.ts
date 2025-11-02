import { createEvent } from "#base";
import { ContainerBuilder, TextDisplayBuilder } from "discord.js";

createEvent({
    name: "Log de Saída",
    event: "guildMemberRemove",
    async run(member){

        const ChannelLogsSaida = process.env.CHANNEL_ID_LOGS_SAIDA;
        const LinkSite = process.env.LINK_SITE;
        const LinkDiscord = process.env.LINK_DISCORD;

        if (!ChannelLogsSaida) {
            return console.error("Canal de logs de saída não está configurado nas variáveis de ambiente.");
        }

        const channel = member.guild.channels.cache.get(ChannelLogsSaida);
        if (!channel || !channel.isTextBased()) {
            return console.error("Canal de logs de saída não encontrado ou não é um canal de texto.");
        }

        const container = new ContainerBuilder({
            accent_color: 0xe74c3c,
        });
        
        // Adiciona thumbnail do avatar do usuário
        (container.data as any).thumbnail_url = member.user.displayAvatarURL({ size: 1024, extension: 'png', forceStatic: false });

        container.addTextDisplayComponents(
            new TextDisplayBuilder({
                content: "> 👋 Até Logo"
            }),

            new TextDisplayBuilder({
                content: `> <@${member.user.id}> saiu do servidor **Nox Code**. Esperamos que volte em breve! 😢`
            }),

            new TextDisplayBuilder({
                content: `[Nosso Site](${LinkSite}) | [Suporte](${LinkDiscord})`
            })
        )

        await channel.send({ 
            flags: ['IsComponentsV2'],
            components: [container],
        });
        
    }
});
