import { createResponder, ResponderType } from "#base";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, ContainerBuilder, PermissionsBitField, TextChannel, TextDisplayBuilder } from "discord.js";

// Map para armazenar os timeouts de cada ticket (fora da função)
const ticketTimeouts = new Map<string, NodeJS.Timeout>();

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

        const container = new ContainerBuilder({
            accent_color: 0x00ff00,
        })

        container.addTextDisplayComponents(
            new TextDisplayBuilder({
                content: `Olá ${interaction.user}, bem-vindo ao seu ticket! Nossa equipe de suporte irá ajudá-lo em breve.`,
            }),

            new TextDisplayBuilder({
                content: "Por favor, descreva seu problema ou dúvida com o máximo de detalhes possível.",
            }),

            new TextDisplayBuilder({
                content: "Para encerrar o ticket, clique no botão abaixo.",
            })
        )


        const closeButtonRow = new ActionRowBuilder<ButtonBuilder>({
            components: [
                new ButtonBuilder({
                    label: "Fechar Ticket",
                    style: ButtonStyle.Danger,
                    customId: "close_ticket",
                })
            ]
        })

        await channel?.send({
            components: [container, closeButtonRow],
            flags: ['IsComponentsV2'],
        });

        // inicia o timer de inatividade para o canal do ticket
        if (channel && channel.isTextBased() && (channel.type === ChannelType.GuildText)) {
            startInactivityTimer(channel as TextChannel, interaction.user.id);
            
            // Listener para mensagens no canal
            const collector = channel.createMessageCollector({
                filter: (msg) => !msg.author.bot,
            });

            collector.on('collect', () => {
                // Reset o timer quando houver uma mensagem
                resetInactivityTimer(channel as TextChannel, interaction.user.id);
            });
        }

        await interaction.reply({ 
            content: `Seu ticket foi criado: ${channel}`,
            flags: ['Ephemeral'],
        });
    },
});

function startInactivityTimer(channel: TextChannel, userId: string) {
    // Limpa qualquer timer existente
    if (ticketTimeouts.has(channel.id)) {
        clearTimeout(ticketTimeouts.get(channel.id)!);
    }

    // Cria novo timer de 12 minutos (720000ms)
    const timeout = setTimeout(async () => {
        const container = new ContainerBuilder({
            accent_color: 0xFFA500,
        });

        container.addTextDisplayComponents(
            new TextDisplayBuilder({
                content: `⚠️ <@${userId}> Este ticket está inativo há 12 minutos.`,
            }),
            new TextDisplayBuilder({
                content: "Por favor, responda se ainda precisa de ajuda ou feche o ticket.",
            })
        );

        await channel.send({
            components: [container],
            flags: ['IsComponentsV2'],
        });

        ticketTimeouts.delete(channel.id);
    }, 720000); // 12 minutos (720000ms) - use 60000 para 1 minuto de teste

    ticketTimeouts.set(channel.id, timeout);
}

function resetInactivityTimer(channel: TextChannel, userId: string) {
    startInactivityTimer(channel, userId);
}