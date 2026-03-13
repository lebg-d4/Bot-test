const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { loadData, getPlayer } = require("../utils/data");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("releve")
        .setDescription("Voir ton relevé bancaire RP"),

    async execute(interaction) {
        const userId = interaction.user.id;
        const data = loadData();
        const player = getPlayer(data, userId);

        if (!player.transactions || player.transactions.length === 0) {
            return interaction.reply({
                content: "📭 Aucun mouvement bancaire pour le moment.",
                ephemeral: true
            });
        }

        const lignes = player.transactions
            .slice(-10) // les 10 dernières transactions
            .map(t => {
                if (t.type === "entrant") {
                    return `🟢 +${t.montant}$ de <@${t.de}> — *${t.date}*`;
                } else {
                    return `🔴 -${t.montant}$ vers <@${t.vers}> — *${t.date}*`;
                }
            })
            .join("\n");

        const embed = new EmbedBuilder()
            .setTitle("📄 Relevé bancaire RP")
            .setColor("#3498db")
            .setDescription(lignes)
            .setFooter({ text: "Dernières transactions" });

        return interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
