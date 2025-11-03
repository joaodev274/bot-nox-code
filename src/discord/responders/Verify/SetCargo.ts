import { createResponder, ResponderType } from "#base";

createResponder({
    customId: "start_verification",
    types: [ResponderType.Button], cache: "cached",
    async run(interaction) {
        
        // Ler ID do cargo a partir do .env (com fallback)
        const idCargo = process.env.VERIFY_ROLE_ID ?? "1433572879341191381";

        const userSet = interaction.guild?.members.cache.get(interaction.user.id);
        if (userSet) {
            await userSet.roles.add(idCargo);
        }


        await interaction.reply({
            content: "Cargo atribuído com sucesso!",
            ephemeral: true,
        });

    },
});