const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("boutique")
        .setDescription("Afficher la boutique RP."),

    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setTitle("🛒 Boutique RP")
            .setDescription("Choisis une catégorie pour voir les articles disponibles.")
            .setColor("#2b2d31")
            .setThumbnail(interaction.client.user.displayAvatarURL());

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("shop:armes")
                .setLabel("Armes")
                .setStyle(ButtonStyle.Danger),

            new ButtonBuilder()
                .setCustomId("shop:objets")
                .setLabel("Objets")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId("shop:nourriture")
                .setLabel("Nourriture")
                .setStyle(ButtonStyle.Success)
        );

        return interaction.reply({
            embeds: [embed],
            components: [row],
            flags: 64
        });
    }
};
