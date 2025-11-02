import { createCommand } from "#base";
import { ActionRowBuilder, ApplicationCommandType, ButtonBuilder, ButtonStyle, ContainerBuilder, TextDisplayBuilder } from "discord.js";

createCommand({
    name: "sorteio",
    description: "ONASK BOT | Comando de sorteio",
    type: ApplicationCommandType.ChatInput,
    options: [
         {
            name: "time",
            description: "Time do sorteio em segundos",
            type: 4, // Integer
            required: true,
            choices: [
                {name: "10 segundos", value: 10 },
                { name: "30 segundos", value: 30 },
                { name: "1 minuto", value: 60 },
                { name: "5 minutos", value: 300 },
                { name: "10 minutos", value: 600 },
                { name: "30 minutos", value: 1800 },
                { name: "1 hora", value: 3600 },
                { name: "2 horas", value: 7200 },
                { name: "6 horas", value: 21600 },
                { name: "12 horas", value: 43200 },
                { name: "24 horas", value: 86400 },
                { name: "48 horas", value: 172800 },
            ],
         },

         {
            name: "text",
            description: "Texto do sorteio",
            type: 3, // String
            required: true,
            maxLength: 256,
         },

         {
            name: "escolheqtpessoas",
            description: "Quantidade de pessoas a serem sorteadas",
            type: 4, // Integer
            required: false,
            choices: [
                { name: "1 pessoa", value: 1 },
                { name: "2 pessoas", value: 2 },
                { name: "3 pessoas", value: 3 },
                { name: "4 pessoas", value: 4 },
                { name: "5 pessoas", value: 5 },
                { name: "10 pessoas", value: 10 },
            ],
         }

    ],
    async run(interaction){

        const time = interaction.options.getInteger("time", true);
        const text = interaction.options.getString("text", true);
        const winnersCount = interaction.options.getInteger("escolheqtpessoas") || 1;

        if (time <= 0) {
            await interaction.reply({ content: "O tempo do sorteio deve ser maior que zero segundos.", ephemeral: true });
            return;
        }

        const endTime = Date.now() + time * 1000;

        const container = new ContainerBuilder({
            accent_color: 0xFFD700,
        });

        container.addTextDisplayComponents(
            new TextDisplayBuilder({
                content: `# 🎉 Sorteio Iniciado!\n\n**${text}**`
            }),

            new TextDisplayBuilder({
                content: `> 🏆 **Vencedores:** ${winnersCount} ${winnersCount === 1 ? 'pessoa' : 'pessoas'}\n> ⏳ **Termina:** <t:${Math.floor(endTime / 1000)}:R>\n> 👥 **Participantes:** 0`
            }),

            new TextDisplayBuilder({
                content: `Clique no botão abaixo para participar! 🍀`
            })
        )

        const row = new ActionRowBuilder<ButtonBuilder>({
            components: [
                new ButtonBuilder({
                    customId: `start_sorteio`,
                    label: "🎉 Participar",
                    style: ButtonStyle.Success,
                })
            ]
        })

        const message = await interaction.reply({ 
            fetchReply: true,
            components: [container, row],
            flags: ['IsComponentsV2'],
        });

        // Armazena os dados do sorteio
        if (!(global as any).giveawayData) {
            (global as any).giveawayData = new Map();
        }
        (global as any).giveawayData.set(message.id, {
            text,
            endTime,
            winnersCount,
            channelId: interaction.channelId
        });

        // Agenda o sorteio para finalizar
        setTimeout(async () => {
            try {
                const participants = (global as any).giveawayParticipants?.get(message.id) || [];
                
                if (participants.length === 0) {
                    const endContainer = new ContainerBuilder({
                        accent_color: 0xFF0000,
                    });

                    endContainer.addTextDisplayComponents(
                        new TextDisplayBuilder({
                            content: `# 🎉 Sorteio Finalizado!`
                        }),
                        new TextDisplayBuilder({
                            content: `**${text}**\n\n> ❌ **Nenhum participante**\n> O sorteio foi cancelado por falta de participantes.`
                        })
                    );

                    await message.edit({
                        flags: ['IsComponentsV2'],
                        components: [endContainer],
                    });
                    return;
                }

                // Sorteia os vencedores
                const winners: string[] = [];
                const availableParticipants = [...participants];
                const actualWinnersCount = Math.min(winnersCount, participants.length);

                for (let i = 0; i < actualWinnersCount; i++) {
                    const randomIndex = Math.floor(Math.random() * availableParticipants.length);
                    winners.push(availableParticipants[randomIndex]);
                    availableParticipants.splice(randomIndex, 1);
                }

                const winnerContainer = new ContainerBuilder({
                    accent_color: 0x00FF00,
                });

                const winnersList = winners.map((id, index) => `${index + 1}. <@${id}>`).join('\n');

                winnerContainer.addTextDisplayComponents(
                    new TextDisplayBuilder({
                        content: `# 🎊 Sorteio Finalizado!`
                    }),
                    new TextDisplayBuilder({
                        content: `**${text}**\n\n> 🏆 **${winners.length === 1 ? 'Vencedor' : 'Vencedores'}:**\n${winnersList}\n\n> 👥 **Total de participantes:** ${participants.length}`
                    }),
                    new TextDisplayBuilder({
                        content: `Parabéns aos vencedores! 🎉`
                    })
                );

                await message.edit({
                    flags: ['IsComponentsV2'],
                    components: [winnerContainer],
                });

                // Menciona os vencedores
                const mentionWinners = winners.map(id => `<@${id}>`).join(' ');
                await interaction.channel?.send({
                    content: `🎊 **PARABÉNS AOS VENCEDORES DO SORTEIO!** 🎊\n\n${mentionWinners}\n\nEntrem em contato com a equipe para reivindicar seu prêmio! 🏆`
                });

                // Limpa os participantes e dados
                (global as any).giveawayParticipants?.delete(message.id);
                (global as any).giveawayData?.delete(message.id);

            } catch (error) {
                console.error("Erro ao finalizar sorteio:", error);
            }
        }, time * 1000);

        console.log(`[SORTEIO] Criado sorteio ${message.id} - Termina em ${time}s`);
    }
});     