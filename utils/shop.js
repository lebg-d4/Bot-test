const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { loadData, saveData } = require("./data");

module.exports.handleShopButtons = async function (interaction) {
    const id = interaction.customId;
    const data = loadData();
    const userId = interaction.user.id;

    if (!data.shop) data.shop = { armes: [], objets: [], nourriture: [] };

    // ------------------ AFFICHAGE DES CATÉGORIES ------------------
    if (id.startsWith("shop:")) {
        const cat = id.split(":")[1];
        const items = data.shop[cat];

        if (!items || items.length === 0) {
            return interaction.reply({
                content: "❌ Aucun article dans cette catégorie.",
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setTitle(`🛒 ${cat.charAt(0).toUpperCase() + cat.slice(1)}`)
            .setColor("#2b2d31")
            .setDescription(
                items.map(i => `• **${i.nom}** — ${i.prix}$`).join("\n")
            );

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`shopbuy:${cat}`)
                .setLabel("Acheter")
                .setStyle(ButtonStyle.Success)
        );

        return interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true
        });
    }

    // ------------------ ACHAT ------------------
    if (id.startsWith("shopbuy:")) {
        const cat = id.split(":")[1];
        const items = data.shop[cat];

        const player = data[userId];
        if (!player) {
            return interaction.reply({
                content: "❌ Tu n'as pas de profil RP.",
                ephemeral: true
            });
        }

        const item = items[0]; // tu peux améliorer pour choisir un item précis

        if (player.bank.cash < item.prix) {
            return interaction.reply({
                content: "❌ Pas assez de cash.",
                ephemeral: true
            });
        }

        player.bank.cash -= item.prix;
        player.inventory.push(item);

        saveData(data);

        return interaction.reply({
            content: `✅ Tu as acheté **${item.nom}** pour **${item.prix}$**.`,
            ephemeral: true
        });
    }
};
