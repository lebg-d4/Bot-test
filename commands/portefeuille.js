const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { loadData, getPlayer } = require("../utils/data");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("portefeuille")
        .setDescription("Afficher ton portefeuille RP"),

    async execute(interaction) {
        const userId = interaction.user.id;

        const data = loadData();
        const player = getPlayer(data, userId);

        if (!player) {
            return interaction.reply({
                content: "❌ Impossible de charger ton profil RP.",
                ephemeral: true
            });
        }

        // Sécurisation de la photo
        const photo =
            player.photo && player.photo.startsWith("http")
                ? player.photo
                : interaction.user.displayAvatarURL({ dynamic: true });

        // -------------------------
        // EMBED PORTFEUILLE RP
        // -------------------------
        const embed = new EmbedBuilder()
            .setTitle("💼 PORTFEUILLE RP")
            .setColor("#f1c40f")
            .setThumbnail(photo)
            .setDescription(
                `👤 **${interaction.user.username}**\n\n` +
                `🏦 **Banque : ${player.bank.solde}$**\n\n` +
                `📄 **Carte d'identité** — Affiche tes informations civiles RP\n` +
                `🔫 **PPA** — Montre ton permis de port d’armes\n` +
                `🚗 **Permis** — Affiche ton permis de conduire\n` +
                `🏦 **Banque** — Ouvre ton compte bancaire RP`
            );

        // -------------------------
        // 4 BOUTONS RP
        // -------------------------
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`doc:carteid:${userId}`)
                .setLabel("Carte d'identité")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId(`doc:ppa:${userId}`)
                .setLabel("PPA")
                .setStyle(ButtonStyle.Danger),

            new ButtonBuilder()
                .setCustomId(`doc:permis:${userId}`)
                .setLabel("Permis")
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId(`bank:open:${userId}`)
                .setLabel("Banque")
                .setStyle(ButtonStyle.Secondary)
        );

        return interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
        });
    }
};
