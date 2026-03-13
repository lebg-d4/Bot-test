const {
    SlashCommandBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

const OWNER_ID = "864242023367835658";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("cree")
        .setDescription("Créer un document RP pour un joueur.")
        .addUserOption(option =>
            option.setName("joueur")
                .setDescription("Le joueur concerné")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("type")
                .setDescription("Type de document")
                .setRequired(true)
                .addChoices(
                    { name: "Carte d'identité", value: "carteid" },
                    { name: "PPA", value: "ppa" },
                    { name: "Permis de conduire", value: "permis" },
                    { name: "Compte bancaire", value: "banque" }
                )
        ),

    async execute(interaction) {

        // 🔥 Permission : uniquement toi
        if (interaction.user.id !== OWNER_ID) {
            return interaction.reply({ content: "❌ Tu n'as pas la permission.", ephemeral: true });
        }

        const user = interaction.options.getUser("joueur");
        const type = interaction.options.getString("type");

        // -------------------------
        // CARTE IDENTITÉ
        // -------------------------
        if (type === "carteid") {
            const modal = new ModalBuilder()
                .setCustomId(`create_carteid_${user.id}`)
                .setTitle("Créer Carte d'identité");

            modal.addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId("nom").setLabel("Nom").setStyle(TextInputStyle.Short).setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId("prenom").setLabel("Prénom").setStyle(TextInputStyle.Short).setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId("sexe").setLabel("Sexe").setStyle(TextInputStyle.Short).setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId("naissance").setLabel("Date de naissance").setStyle(TextInputStyle.Short).setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId("Nationalité").setLabel("Nationalité").setStyle(TextInputStyle.Short).setRequired(false)
                )
            );

            return interaction.showModal(modal);
        }

        // -------------------------
        // PPA
        // -------------------------
        if (type === "ppa") {
            const modal = new ModalBuilder()
                .setCustomId(`create_ppa_${user.id}`)
                .setTitle("Créer PPA");

            modal.addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId("nom").setLabel("Nom").setStyle(TextInputStyle.Short).setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId("prenom").setLabel("Prénom").setStyle(TextInputStyle.Short).setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId("naissance").setLabel("Date de naissance").setStyle(TextInputStyle.Short).setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId("validation").setLabel("Date de validation").setStyle(TextInputStyle.Short).setRequired(true)
                )
            );

            return interaction.showModal(modal);
        }

        // -------------------------
        // PERMIS
        // -------------------------
        if (type === "permis") {
            const modal = new ModalBuilder()
                .setCustomId(`create_permis_${user.id}`)
                .setTitle("Créer Permis");

            modal.addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId("nom").setLabel("Nom").setStyle(TextInputStyle.Short).setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId("prenom").setLabel("Prénom").setStyle(TextInputStyle.Short).setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId("naissance").setLabel("Date de naissance").setStyle(TextInputStyle.Short).setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId("validation").setLabel("Date de validation").setStyle(TextInputStyle.Short).setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId("points").setLabel("Points sur 12").setStyle(TextInputStyle.Short).setRequired(true)
                )
            );

            return interaction.showModal(modal);
        }

        // -------------------------
        // BANQUE
        // -------------------------
        if (type === "banque") {
            const modal = new ModalBuilder()
                .setCustomId(`create_banque_${user.id}`)
                .setTitle("Créer Compte Bancaire");

            modal.addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId("cash").setLabel("Cash initial").setStyle(TextInputStyle.Short).setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId("solde").setLabel("Solde initial").setStyle(TextInputStyle.Short).setRequired(true)
                )
            );

            return interaction.showModal(modal);
        }
    }
};
