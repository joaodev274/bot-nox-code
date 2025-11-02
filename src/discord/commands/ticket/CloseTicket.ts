import { createCommand } from "#base";
import { createContainer,  } from "@magicyan/discord";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, TextDisplayBuilder } from "discord.js";

createCommand({
    name: "close-ticket",
    description: "ONASK BOT | Fechar Ticket",
    
    async run(interaction) {
        const container = createContainer({
            accentColor: "#ff0000",
        });
        container.addTextDisplayComponents(
            new TextDisplayBuilder({
                content: '🔒 | Fechamento de Ticket\n\nVocê tem certeza que deseja fechar este ticket? Esta ação excluirá o canal do ticket e não poderá ser desfeita.',
            })
        );

        const row = new ActionRowBuilder<ButtonBuilder>({
            components: [
                new ButtonBuilder({
                    customId: 'confirm_close_ticket',
                    label: 'Confirmar Fechamento',
                    style: ButtonStyle.Danger,
                })
            ]
        });

        await interaction.reply({ content: "Ticket fechado.", ephemeral: true, components: [row] });
    },
});