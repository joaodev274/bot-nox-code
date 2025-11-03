import { createResponder, ResponderType } from "#base";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder, TextDisplayBuilder } from "discord.js";

createResponder({
    customId: "start_sorteio",
    types: [ResponderType.Button], 
    cache: "cached",
    async run(interaction) {
      
        try {
            const messageId = interaction.message.id;
            
            console.log(`[SORTEIO] Botão clicado no sorteio ${messageId} por ${interaction.user.tag}`);
            
            // Busca os dados do sorteio
            const giveawayData = (global as any).giveawayData?.get(messageId);
            
            if (!giveawayData) {
                console.log(`[SORTEIO] Dados não encontrados para ${messageId}`);
                await interaction.reply({
                    content: "❌ Dados do sorteio não encontrados!",
                    flags: ["Ephemeral"]
                });
                return;
            }

            const { text, endTime, winnersCount } = giveawayData;
            console.log(`[SORTEIO] Dados encontrados - Texto: ${text}, Termina: ${endTime}, Vencedores: ${winnersCount}`);
            
            // Inicializa o Map global se não existir
            if (!(global as any).giveawayParticipants) {
                (global as any).giveawayParticipants = new Map();
            }

            const participants = (global as any).giveawayParticipants.get(messageId) || [];
            
            // Verifica se o usuário já está participando
            if (participants.includes(interaction.user.id)) {
                await interaction.reply({
                    content: "❌ Você já está participando deste sorteio!",
                    flags: ["Ephemeral"]
                });
                return;
            }

            // Verifica se o sorteio já acabou
            const now = Date.now();
            
            if (now >= endTime) {
                await interaction.reply({
                    content: "❌ Este sorteio já foi finalizado!",
                    flags: ["Ephemeral"]
                });
                return;
            }

            // Adiciona o participante
            participants.push(interaction.user.id);
            (global as any).giveawayParticipants.set(messageId, participants);

            console.log(`[SORTEIO] ${interaction.user.tag} adicionado! Total de participantes: ${participants.length}`);

            // Responde ao usuário primeiro
            await interaction.reply({
                content: `✅ Você entrou no sorteio com sucesso! Boa sorte! 🍀\n> Total de participantes agora: **${participants.length}**`,
                flags: ["Ephemeral"]
            });

            // Atualiza a embed com o novo contador de participantes
            const originalMessage = interaction.message;

            const updatedContainer = new ContainerBuilder({
                accent_color: 0xFFD700,
            });

            updatedContainer.addTextDisplayComponents(
                new TextDisplayBuilder({
                    content: `# 🎉 Sorteio Iniciado!\n\n**${text}**`
                }),
                new TextDisplayBuilder({
                    content: `> 🏆 **Vencedores:** ${winnersCount} ${winnersCount === 1 ? 'pessoa' : 'pessoas'}\n> ⏳ **Termina:** <t:${Math.floor(endTime / 1000)}:R>\n> 👥 **Participantes:** ${participants.length}`
                }),
                new TextDisplayBuilder({
                    content: `Clique no botão abaixo para participar! 🍀`
                })
            );

            const row = new ActionRowBuilder<ButtonBuilder>({
                components: [
                    new ButtonBuilder({
                        customId: `start_sorteio`,
                        label: "🎉 Participar",
                        style: ButtonStyle.Success,
                    })
                ]
            });

            await originalMessage.edit({
                flags: ['IsComponentsV2'],
                components: [updatedContainer, row],
            });

        } catch (error) {
            console.error("Erro no responder do sorteio:", error);
            
            // Tenta responder com erro se ainda não respondeu
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: "❌ Ocorreu um erro ao processar sua participação. Tente novamente!",
                    flags: ["Ephemeral"]
                });
            }
        }
        
    },
});