const { SlashCommandBuilder } = require("discord.js");
const { loadData, saveData, getPlayer } = require("../utils/data");

const STAFF_ROLE = "1452319594420244543";
const OWNER_ID = "864242023367835658";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ajouter_photo")
        .setDescription("Ajouter une photo RP à un joueur (STAFF).")
        .addUserOption(option =>
            option.setName("joueur")
                .setDescription("Le joueur concerné")
                .setRequired(true)
        )
        .addAttachmentOption(option =>
            option.setName("image")
                .setDescription("Upload direct de la photo RP")
                .setRequired(true)
        ),

    async execute(interaction) {

        // 🔐 Permission : STAFF OU propriétaire
        if (
            interaction.user.id !== OWNER_ID &&
            !interaction.member.roles.cache.has(STAFF_ROLE)
        ) {
            return interaction.reply({
                content: "❌ Tu n'as pas la permission d'utiliser cette commande.",
                flags: 64
            });
        }

        const user = interaction.options.getUser("joueur");
        const image = interaction.options.getAttachment("image");

        if (!image || !image.url) {
            return interaction.reply({
                content: "❌ Image invalide.",
                flags: 64
            });
        }

        const data = loadData();
        const player = getPlayer(data, user.id);

        player.photo = image.url;
        saveData(data);

        return interaction.reply({
            content: `✅ Photo RP enregistrée pour ${user}.`,
            flags: 64
        });
    }
};
