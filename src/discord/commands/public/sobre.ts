import { ApplicationCommandType, ContainerBuilder, TextDisplayBuilder } from "discord.js";
import { createCommand } from "#base";

createCommand({
    name: "sobre",
    description: "ONASK BOT | Sobre a loja oficial e redes sociais.",
    type: ApplicationCommandType.ChatInput,
    async run(interaction){

        const container = new ContainerBuilder({
            accent_color: 0x0099ff,
        })

        container.addTextDisplayComponents(
            new TextDisplayBuilder({
                content: '**Sobre Nox Code**\n\nOlá sou **Onask Bot**, o assistente virtual da Nox Code! A Nox Code é uma loja oficial especializada em produtos digitais, oferecendo uma ampla variedade de itens como jogos, softwares, assinaturas e muito mais. Nosso objetivo é proporcionar aos nossos clientes uma experiência de compra segura, rápida e confiável.\n\n**Redes Sociais**\n\nFique por dentro das nossas novidades, promoções e lançamentos seguindo nossas redes sociais:\n\n- Instagram: [@noxcodeoficial](https://www.instagram.com/noxcodeoficial/)\n- Twitter: [@noxcode](https://twitter.com/noxcode)\n- Facebook: [Nox Code](https://www.facebook.com/noxcodeoficial)\n- YouTube: [Nox Code](https://www.youtube.com/noxcode)\n\nAgradecemos por escolher a Nox Code para suas compras digitais. Estamos sempre à disposição para ajudar no que for necessário!\n\nAtenciosamente,\nEquipe Nox Code',
            })
        )

        
        await interaction.reply({
            flags: ['Ephemeral', 'IsComponentsV2'],
            components: [container],
        })

    }
});