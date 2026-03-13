const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { loadData, getPlayer } = require("../utils/data");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("inventaire")
        .setDescription("Voir ton inventaire RP ou celui d'un joueur.")
        .addUserOption(option =>
            option.setName("joueur")
                .setDescription("Le joueur dont tu veux voir l'inventaire")
                .setRequired(false)
        ),

    async execute(interaction) {
        const target = interaction.options.getUser("joueur") || interaction.user;

        const data = loadData();
        const player = getPlayer(data, target.id);

        if (!player) {
            return interaction.reply({
                content: "❌ Aucun inventaire trouvé pour ce joueur.",
                flags: 64
            });
        }

        const inventory = player.inventory || [];

        const embed = new EmbedBuilder()
            .setTitle(`🎒 Inventaire de ${target.username}`)
            .setColor("#8e44ad")
            .setThumbnail(target.displayAvatarURL({ dynamic: true }))
            .setDescription(
                inventory.length === 0
                    ? "📭 Inventaire vide."
                    : inventory.map(item =>
                        `• **${item.nom}** — x${item.quantite}`
                    ).join("\n")
            );

        return interaction.reply({
            embeds: [embed],
            flags: 0
        });
    }
};
