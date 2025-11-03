import { createEvent } from "#base";
import { ContainerBuilder, TextDisplayBuilder } from "discord.js";

createEvent({
    name: "Log de Entrada",
    event: "guildMemberAdd",
    async run(member){

        const ChannelLogsEntrada = process.env.CHANNEL_ID_LOGS_ENTRADA;
        const LinkSite = process.env.LINK_SITE;
        const LinkDiscord = process.env.LINK_DISCORD;

        if (!ChannelLogsEntrada) {
            return console.error("Canal de logs de entrada não está configurado nas variáveis de ambiente.");
        }

        const channel = member.guild.channels.cache.get(ChannelLogsEntrada);
        if (!channel || !channel.isTextBased()) {
            return console.error("Canal de logs de entrada não encontrado ou não é um canal de texto.");
        }

        const container = new ContainerBuilder({
            accent_color: 0x3498db,
        });
        
        // Adiciona thumbnail do avatar do usuário
        (container.data as any).thumbnail_url = member.user.displayAvatarURL({ size: 1024, extension: 'png', forceStatic: false });

        container.addTextDisplayComponents(
            new TextDisplayBuilder({
                content: "> 👋 Seja Bem-vindo"
            }),

            new TextDisplayBuilder({
                content: `> <@${member.user.id}> seja bem-vindo(a) a Loja **Nox Code**! Para ter acesso total ao servidor, por favor, dirija-se ao canal <#${'1434301151519572108'}> e siga as instruções para verificar sua conta. Aproveite sua comunidade! 🚀`
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