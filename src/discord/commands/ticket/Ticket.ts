import { createCommand } from "#base";
import { createContainer } from "@magicyan/discord";
import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, TextDisplayBuilder } from "discord.js";

createCommand({
    name: "ticket",
    description: "ONASK BOT | Sistema de Tickets",
    type: ApplicationCommandType.ChatInput,
    async run(interaction){
        

        const container = createContainer({
            accentColor: "#0099ff",
        })

        container.addTextDisplayComponents(
            new TextDisplayBuilder({
                content: '🎫 | Sistema de Tickets\n\nOlá! Precisa de ajuda? Crie um ticket clicando no botão abaixo e nossa equipe de suporte irá auxiliá-lo o mais rápido possível.',
            }),

            new TextDisplayBuilder({
                content: 'Por favor, seja claro e específico ao descrever seu problema ou dúvida. Isso nos ajudará a fornecer uma assistência mais eficaz.',
            })
        )

        const buttonRow = new ActionRowBuilder<ButtonBuilder>({
            components: [
                new ButtonBuilder({
                    customId: 'create_ticket',
                    label: 'Criar Ticket',
                    style: ButtonStyle.Success, // Success style
                })
            ]
        })

    await interaction.reply({
        flags: ['Ephemeral', 'IsComponentsV2'],
        components: [container, buttonRow],

    })
    }
});