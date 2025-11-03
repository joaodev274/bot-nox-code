import { createCommand } from "#base";
import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, ContainerBuilder, TextDisplayBuilder } from "discord.js";

createCommand({
    name: "painel_verificacao",
    description: "ONASK BOT | Painel de verificação",
    type: ApplicationCommandType.ChatInput,
    async run(interaction){
        const container = new ContainerBuilder({
            accent_color: 0xFF5733,
        })

        container.addTextDisplayComponents(
            new TextDisplayBuilder({
                content: "Bem-vindo ao Painel de Verificação! Por favor, siga as instruções para completar sua verificação.",
            }),

            new TextDisplayBuilder({
                content: "Clique no botão abaixo para iniciar o processo de verificação.",
            })
        )

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder({
                customId: "start_verification",
                label: "Iniciar Verificação",
                style: ButtonStyle.Primary,
            })
        );

        await interaction.reply({
            components: [container ,row],
            flags: ['Ephemeral', 'IsComponentsV2']
        });
    }
});