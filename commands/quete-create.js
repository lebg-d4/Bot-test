const { SlashCommandBuilder } = require("discord.js");
const { loadData, saveData } = require("../utils/data");

const STAFF_ID = "864242023367835658";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("quete-create")
        .setDescription("Créer un lieu de braquage (STAFF).")
        .addStringOption(option =>
            option.setName("nom")
                .setDescription("Nom du braquage (ex: Supérette, Bijouterie...)")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName("gain")
                .setDescription("Argent gagné (déposé en banque)")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName("attente")
                .setDescription("Temps d'attente en secondes")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName("cooldown")
                .setDescription("Cooldown en secondes")
                .setRequired(true)
        ),

    async execute(interaction) {

        if (interaction.user.id !== STAFF_ID) {
            return interaction.reply({
                content: "❌ Tu n'as pas la permission d'utiliser cette commande.",
                ephemeral: true
            });
        }

        const nom = interaction.options.getString("nom");
        const gain = interaction.options.getInteger("gain");
        const attente = interaction.options.getInteger("attente");
        const cooldown = interaction.options.getInteger("cooldown");

        const data = loadData();
        if (!data.braquages) data.braquages = [];

        const id = `braquage_${Date.now()}`;

        data.braquages.push({
            id,
            nom,
            gain,
            attente,
            cooldown,
            lastUse: 0
        });

        saveData(data);

        return interaction.reply({
            content: `✅ Braquage **${nom}** ajouté.\n💰 Gain : ${gain}$\n⏳ Attente : ${attente}s\n🔁 Cooldown : ${cooldown}s`,
            ephemeral: true
        });
    }
};
