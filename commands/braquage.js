const {
    SlashCommandBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require("discord.js");

const { loadData } = require("../utils/data");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("braquage")
        .setDescription("Choisir un braquage RP."),

    async execute(interaction) {
        const data = loadData();

        // Vérification : aucun braquage configuré
        if (!data.braquages || data.braquages.length === 0) {
            return interaction.reply({
                content: "❌ Aucun braquage n’a été configuré.",
                flags: 64
            });
        }

        // Construction du select menu
        const menu = new StringSelectMenuBuilder()
            .setCustomId("selectBraquage")
            .setPlaceholder("Choisis un lieu de braquage")
            .addOptions(
                data.braquages.map(b => ({
                    label: b.nom,
                    value: String(b.id) // 🔥 Correction obligatoire
                }))
            );

        const row = new ActionRowBuilder().addComponents(menu);

        return interaction.reply({
            content: "🔫 Choisis ton braquage :",
            components: [row],
            flags: 64
        });
    }
};
