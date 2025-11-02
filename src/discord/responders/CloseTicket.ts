import { createResponder, ResponderType } from "#base";;

createResponder({
    customId: "confirm_close_ticket",
    types: [ResponderType.Button],
    async run(interaction) {
        await interaction.channel?.delete();
        await interaction.reply({ content: "O canal do ticket foi fechado e excluído com sucesso.", ephemeral: true });
    }
});