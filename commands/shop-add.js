const { SlashCommandBuilder } = require("discord.js");
const { loadData, saveData } = require("../utils/data");

const STAFF_ID = "864242023367835658";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shop-add")
        .setDescription("Ajouter un item à la boutique (STAFF).")
        .addStringOption(option =>
            option.setName("categorie")
                .setDescription("armes / objets / nourriture")
                .setRequired(true)
                .addChoices(
                    { name: "Armes", value: "armes" },
                    { name: "Objets", value: "objets" },
                    { name: "Nourriture", value: "nourriture" }
                )
        )
        .addStringOption(option =>
            option.setName("nom")
                .setDescription("Nom de l'objet")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName("prix")
                .setDescription("Prix de l'objet")
                .setRequired(true)
        ),

    async execute(interaction) {

        if (interaction.user.id !== STAFF_ID) {
            return interaction.reply({
                content: "❌ Tu n'as pas la permission.",
                flags: 64
            });
        }

        const categorie = interaction.options.getString("categorie");
        const nom = interaction.options.getString("nom");
        const prix = interaction.options.getInteger("prix");

        const data = loadData();
        if (!data.shop) data.shop = { armes: [], objets: [], nourriture: [] };

        data.shop[categorie].push({
            id: `item_${Date.now()}`,
            nom,
            prix
        });

        saveData(data);

        return interaction.reply({
            content: `✅ **${nom}** ajouté dans **${categorie}** pour **${prix}$**.`,
            flags: 64
        });
    }
};
