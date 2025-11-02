import { createResponder, ResponderType } from "#base";
import { ChannelType, PermissionsBitField } from "discord.js";

createResponder({
    customId: "create_ticket",
    types: [ResponderType.Button],
    async run(interaction) {


        const channel = await interaction.guild?.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: interaction.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
                },

                {
                    id: interaction.guild!.roles.everyone,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                    
                },

                {
                    id: process.env.SUPPORT_ROLE_ID ?? '1395390262175465544', // Replace with your support team role ID
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
                }
            ]
        })

        await channel?.send(`Olá ${interaction.user}, bem-vindo ao seu ticket! Nossa equipe de suporte irá ajudá-lo em breve.`);

        await interaction.reply({ content: `Seu ticket foi criado: ${channel}`, ephemeral: true });
    },
});