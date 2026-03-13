const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { loadData, saveData, getPlayer } = require("./data");

module.exports.handleActionButtons = async function (interaction) {
    const parts = interaction.customId.split(":");
    const action = parts[1];
    const auteurId = parts[2];
    const cibleId = parts[3];
    const queteId = parts[4];

    const data = loadData();
    const auteur = getPlayer(data, auteurId);
    const cible = getPlayer(data, cibleId);

    if (!cible) {
        return interaction.reply({ content: "❌ Joueur introuvable.", ephemeral: true });
    }

    // ---------------- MENU DES QUÊTES ----------------
    if (action === "quete") {
        if (!data.quetes || data.quetes.length === 0) {
            return interaction.reply({ content: "❌ Aucune quête RP configurée.", ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle("🗺️ Quêtes RP disponibles")
            .setColor("#e67e22")
            .setDescription("Choisis une quête RP :");

        const row = new ActionRowBuilder();

        data.quetes.forEach(q => {
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(`action:start:${auteurId}:${cibleId}:${q.id}`)
                    .setLabel(q.nom)
                    .setStyle(ButtonStyle.Primary)
            );
        });

        return interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    }

    // ---------------- LANCER UNE QUÊTE ----------------
    if (action === "start") {
        const quete = data.quetes.find(q => q.id == queteId);

        if (!quete) {
            return interaction.reply({ content: "❌ Quête introuvable.", ephemeral: true });
        }

        await interaction.reply({
            content: `⏳ **${quete.nom}** en cours... (${quete.temps} secondes)`,
            ephemeral: true
        });

        setTimeout(() => {
            const gain = Math.floor(Math.random() * (quete.gainMax - quete.gainMin)) + quete.gainMin;

            auteur.bank.solde += gain;
            saveData(data);

            const embed = new EmbedBuilder()
                .setTitle("🗺️ Quête RP terminée")
                .setColor("#2ecc71")
                .setDescription(
                    `🎉 **${quete.nom}** réussie !\n💰 Récompense ajoutée au compte bancaire : **${gain}$**`
                );

            interaction.followUp({ embeds: [embed] });

        }, quete.temps * 1000);

        return;
    }

    // ---------------- FOUILLE RP ----------------
    if (action === "fouille") {
        const inventaire = cible.inventory || [];

        const embed = new EmbedBuilder()
            .setTitle(`🎒 Inventaire RP de ${cible.nom}`)
            .setColor("#8e44ad")
            .setDescription(
                inventaire.length === 0
                    ? "📭 Inventaire vide."
                    : inventaire.map(i => `• **${i.nom}** — x${i.quantite}`).join("\n")
            );

        return interaction.reply({ embeds: [embed] });
    }
};
