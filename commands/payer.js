const {
    SlashCommandBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("payer")
        .setDescription("Envoyer de l'argent à un autre joueur.")
        .addUserOption(option =>
            option.setName("joueur")
                .setDescription("Le joueur à qui envoyer de l'argent")
                .setRequired(true)
        ),

    async execute(interaction) {
        const target = interaction.options.getUser("joueur");
        const sender = interaction.user;

        if (target.id === sender.id) {
            return interaction.reply({
                content: "❌ Tu ne peux pas te payer toi-même.",
                flags: 64
            });
        }

        const modal = new ModalBuilder()
            .setCustomId(`pay_confirm_${sender.id}_${target.id}`)
            .setTitle("Confirmer le paiement");

        const montant = new TextInputBuilder()
            .setCustomId("montant")
            .setLabel("Montant à envoyer")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder().addComponents(montant)
        );

        return interaction.showModal(modal);
    }
};
