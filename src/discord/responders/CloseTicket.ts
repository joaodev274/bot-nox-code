import { createResponder, ResponderType } from "#base";;

createResponder({
    customId: "close_ticket",
    types: [ResponderType.Button],
    async run(interaction) {
        await interaction.channel?.delete();
        await interaction.reply({ content: `O seu canal vai ser Delatado!`, ephemeral: true });
    }
});