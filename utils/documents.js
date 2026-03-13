const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const { loadData, getPlayer } = require("./data");

function safe(v) {
    return v ? String(v) : "Non renseigné";
}

module.exports.handleDocumentButtons = async function (interaction) {
    const [prefix, action, userId] = interaction.customId.split(":");

    const data = loadData();
    const player = getPlayer(data, userId);

    if (!player) {
        return interaction.reply({ content: "❌ Joueur introuvable.", flags: 64 });
    }

    // ---------------- CARTE ID ----------------
    if (action === "carteid") {
        const d = player.docs.carteid;
        if (!d) return interaction.reply({ content: "❌ Aucune carte d'identité.", flags: 64 });

        const embed = new EmbedBuilder()
            .setTitle("🪪 CARTE D'IDENTITÉ")
            .setColor("#3498db")
            .setThumbnail(player.photo || interaction.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: "Nom", value: safe(d.nom), inline: true },
                { name: "Prénom", value: safe(d.prenom), inline: true },
                { name: "Sexe", value: safe(d.sexe), inline: true },
                { name: "Naissance", value: safe(d.naissance), inline: true },
                { name: "Nationalité", value: safe(d.nationalite), inline: true }
            );

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`public:carteid:${userId}`)
                .setLabel("Afficher publiquement")
                .setStyle(ButtonStyle.Primary)
        );

        return interaction.reply({ embeds: [embed], components: [row], flags: 64 });
    }

    // ---------------- PPA ----------------
    if (action === "ppa") {
        const d = player.docs.ppa;
        if (!d) return interaction.reply({ content: "❌ Aucun PPA.", flags: 64 });

        const embed = new EmbedBuilder()
            .setTitle("🔫 PERMIS DE PORT D'ARMES (PPA)")
            .setColor("#e74c3c")
            .setThumbnail(player.photo || interaction.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: "Nom", value: safe(d.nom), inline: true },
                { name: "Prénom", value: safe(d.prenom), inline: true },
                { name: "Naissance", value: safe(d.naissance), inline: true },
                { name: "Validation", value: safe(d.validation), inline: true }
            );

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`public:ppa:${userId}`)
                .setLabel("Afficher publiquement")
                .setStyle(ButtonStyle.Primary)
        );

        return interaction.reply({ embeds: [embed], components: [row], flags: 64 });
    }

    // ---------------- PERMIS ----------------
    if (action === "permis") {
        const d = player.docs.permis;
        if (!d) return interaction.reply({ content: "❌ Aucun permis.", flags: 64 });

        const embed = new EmbedBuilder()
            .setTitle("🚗 PERMIS DE CONDUITE")
            .setColor("#2ecc71")
            .setThumbnail(player.photo || interaction.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: "Nom", value: safe(d.nom), inline: true },
                { name: "Prénom", value: safe(d.prenom), inline: true },
                { name: "Naissance", value: safe(d.naissance), inline: true },
                { name: "Validation", value: safe(d.validation), inline: true },
                { name: "Points", value: safe(d.points), inline: true }
            );

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`public:permis:${userId}`)
                .setLabel("Afficher publiquement")
                .setStyle(ButtonStyle.Primary)
        );

        return interaction.reply({ embeds: [embed], components: [row], flags: 64 });
    }
};

// -------------------------------------------------------------
// 📢 AFFICHAGE PUBLIC
// -------------------------------------------------------------
module.exports.handlePublicDocument = async function (interaction) {
    const [prefix, docType, userId] = interaction.customId.split(":");

    const data = loadData();
    const player = getPlayer(data, userId);

    if (!player) {
        return interaction.reply({ content: "❌ Joueur introuvable.", flags: 64 });
    }

    const docs = {
        carteid: player.docs.carteid,
        ppa: player.docs.ppa,
        permis: player.docs.permis
    };

    const titles = {
        carteid: "🪪 CARTE D'IDENTITÉ",
        ppa: "🔫 PERMIS DE PORT D'ARMES (PPA)",
        permis: "🚗 PERMIS DE CONDUITE"
    };

    const colors = {
        carteid: "#3498db",
        ppa: "#e74c3c",
        permis: "#2ecc71"
    };

    const d = docs[docType];
    if (!d) {
        return interaction.reply({ content: "❌ Document introuvable.", flags: 64 });
    }

    const embed = new EmbedBuilder()
        .setTitle(titles[docType])
        .setColor(colors[docType])
        .setThumbnail(player.photo || interaction.user.displayAvatarURL({ dynamic: true }))
        .addFields(
            Object.entries(d).map(([key, value]) => ({
                name: key.charAt(0).toUpperCase() + key.slice(1),
                value: safe(value),
                inline: true
            }))
        );

    return interaction.reply({
        content: `📢 Document affiché publiquement par <@${interaction.user.id}>`,
        embeds: [embed]
    });
};
