import { ResponderType, createResponder } from "#base";
import { ContainerBuilder, TextDisplayBuilder } from "discord.js";

createResponder({
    customId: "copy_pix_key_button",
    types: [ResponderType.Button], cache: "cached",
    async run(interaction) {
        
        const container = new ContainerBuilder({
            accent_color: 0x00ff00,
        })

        container.addTextDisplayComponents(
            new TextDisplayBuilder({
                content: "> Chave pix:```80be4aca-bdbd-49e0-9efa-13d5a8f78317```",
            })
        )

        await interaction.reply({
            components: [container],
            flags: ['Ephemeral', 'IsComponentsV2'],
        })

    },
});