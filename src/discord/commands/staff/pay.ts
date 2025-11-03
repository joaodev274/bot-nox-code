import { createCommand } from "#base";
import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, ContainerBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, TextDisplayBuilder } from "discord.js";

createCommand({
    name: "pay",
    description: "pay command",
    type: ApplicationCommandType.ChatInput,
    async run(interaction){
        
        const imgQRCODE = 'https://media.discordapp.net/attachments/1434331675789103185/1434331861387182250/image0.jpg?ex=690899e4&is=69074864&hm=b410f66dadfb3bb44ffc8d2aafc9ed2eff3c1d6c01bb3f4a9ac945e4c8901b55&=&format=webp'

        const container = new ContainerBuilder({
            accent_color: 0x0099ff,
        })

        container.addTextDisplayComponents(
            new TextDisplayBuilder({
                content: "# ONASK PAYMENTS | efetue seu pagamento",
            }),

            new TextDisplayBuilder({
                content: "Para efetuar o pagamento, utilize o QR Code abaixo ou copie a chave pix.",
            })
        )

        container.addMediaGalleryComponents(
            new MediaGalleryBuilder()
                .addItems(
                    new MediaGalleryItemBuilder()
                        .setURL(imgQRCODE)
                )
        )

        const row = new ActionRowBuilder<ButtonBuilder>({
            components: [
                new ButtonBuilder({
                    label: "Copiar chave pix",
                    style: ButtonStyle.Primary,
                    custom_id: "copy_pix_key_button"
                })
            ]
        })

        await interaction.reply({
            components: [container, row],
            flags: ['Ephemeral', 'IsComponentsV2'],
        })

    }
});