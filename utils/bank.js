const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle
} = require("discord.js");

const { loadData, saveData, getPlayer } = require("./data");

// -------------------------------------------------------------
// 📌 OUVERTURE DU MENU BANCAIRE
// -------------------------------------------------------------
module.exports.handleBankButtons = async function (interaction) {
    const [prefix, action, userId] = interaction.customId.split(":");

    const data = loadData();
    const player = getPlayer(data, userId);

    if (!player) {
        return interaction.reply({ content: "❌ Joueur introuvable.", flags: 64 });
    }

    // ---------------------------------------------------------
    // 🏦 MENU PRINCIPAL
    // ---------------------------------------------------------
    if (action === "open") {
        const embed = new EmbedBuilder()
            .setTitle("🏦 Banque RP")
            .setColor("#f1c40f")
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: "Cash", value: `${player.bank.cash}$`, inline: true },
                { name: "Solde bancaire", value: `${player.bank.solde}$`, inline: true }
            );

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`bank:depot:${userId}`)
                .setLabel("Déposer")
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId(`bank:retrait:${userId}`)
                .setLabel("Retirer")
                .setStyle(ButtonStyle.Danger)
        );

        return interaction.reply({ embeds: [embed], components: [row], flags: 64 });
    }

    // ---------------------------------------------------------
    // 🏦 DÉPÔT → OUVERTURE DU MODAL
    // ---------------------------------------------------------
    if (action === "depot") {
        const modal = new ModalBuilder()
            .setCustomId(`bank_depot_${userId}`)
            .setTitle("🏦 Dépôt bancaire");

        const montant = new TextInputBuilder()
            .setCustomId("montant")
            .setLabel("Montant à déposer")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        modal.addComponents(new ActionRowBuilder().addComponents(montant));

        return interaction.showModal(modal);
    }

    // ---------------------------------------------------------
    // 🏦 RETRAIT → OUVERTURE DU MODAL
    // ---------------------------------------------------------
    if (action === "retrait") {
        const modal = new ModalBuilder()
            .setCustomId(`bank_retrait_${userId}`)
            .setTitle("🏦 Retrait bancaire");

        const montant = new TextInputBuilder()
            .setCustomId("montant")
            .setLabel("Montant à retirer")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        modal.addComponents(new ActionRowBuilder().addComponents(montant));

        return interaction.showModal(modal);
    }
};
