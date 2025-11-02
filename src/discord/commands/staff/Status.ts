import { createCommand } from "#base";
import { ActivityType, ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";

// Ler ID do cargo a partir do .env (com fallback para o valor atual)
const VERIFY_ROLE_ID = process.env.VERIFY_ROLE_ID ?? "1433572879341191381";

createCommand({
    name: "status",
    description: "Altera o status/presença do bot (apenas para cargo específico)",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "presence",
            description: "Status do Discord (escolha abaixo)",
            type: ApplicationCommandOptionType.String,
            choices: [
                { name: "Online", value: "online" },
                { name: "Ausente (idle)", value: "idle" },
                { name: "Ocupado (dnd)", value: "dnd" },
                { name: "Invisível", value: "invisible" },
            ],
            required: false,
        },
        {
            name: "text",
            description: "Texto da atividade (ex: Jogando X). Máx. 128 caracteres.",
            type: ApplicationCommandOptionType.String,
            required: false,
            maxLength: 128,
        }
    ],
    async run(interaction){
        // Deferir resposta para evitar timeouts/erros de interação antiga
        await interaction.deferReply({ ephemeral: true });

        // Permissão por cargo
        const member = interaction.guild?.members.cache.get(interaction.user.id) || (interaction.member as any)?.member;
        if (!member) {
            await interaction.editReply({ content: "Não foi possível localizar seu usuário no servidor." });
            return;
        }

        if (!member.roles.cache.has(VERIFY_ROLE_ID)) {
            await interaction.editReply({ content: "Você não tem permissão para usar este comando. (Cargo necessário)" });
            return;
        }

        const presence = interaction.options.getString("presence", false) as ("online" | "idle" | "dnd" | "invisible" | null);
    const text = interaction.options.getString("text", false);

        try {
            const client = interaction.client;

            // If nothing provided, respond help
            if (!presence && (!text || text.trim().length === 0)) {
                await interaction.editReply({
                    content: "Por favor informe ao menos a opção `presence` (online/idle/dnd/invisible) ou `text` (ex: Jogando X).\nExemplo: /status presence:online text:Jogando futebol",
                });
                return;
            }

            // Prepare presence payload
            const activities = (typeof text === "string" && text.trim().length > 0)
                ? [{ name: text.trim(), type: ActivityType.Playing }]
                : [];

            const status = presence ?? undefined;

            // Apply presence explicitly
            await client.user?.setPresence({ activities, status });

            const mapStatusPt: Record<string, string> = {
                online: "Online",
                idle: "Ausente",
                dnd: "Ocupado",
                invisible: "Invisível",
            };

            const parts: string[] = [];
            if (status) parts.push(`status: ${mapStatusPt[status] ?? status}`);
            if (text) parts.push(`atividade: ${text}`);

            await interaction.editReply({ content: `Presença atualizada (${parts.join(" | ")}).` });
        } catch (err) {
            // Tentar editar a reply diferida; se falhar, tentar reply simples
            try {
                await interaction.editReply({ content: `Erro ao atualizar presença: ${(err as Error).message}` });
            } catch {
                // fallback
                // @ts-ignore
                await interaction.followUp({ content: `Erro ao atualizar presença: ${(err as Error).message}`, ephemeral: true });
            }
        }
    }
});