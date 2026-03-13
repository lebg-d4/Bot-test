const { loadData, saveData, getPlayer } = require("./data");

module.exports.handleModal = async function (interaction) {
    const id = interaction.customId;
    const data = loadData();

    function ensurePlayer(userId) {
        if (!data[userId]) {
            data[userId] = {
                docs: {
                    carteid: null,
                    ppa: null,
                    permis: null
                },
                bank: {
                    cash: 0,
                    solde: 0
                },
                photo: null,
                transactions: [],
                inventory: []
            };
        }
        return data[userId];
    }

    // ---------------------------------------------------------
    // 🪪 CARTE D'IDENTITÉ (sans photo)
    // ---------------------------------------------------------
    if (id.startsWith("create_carteid_")) {
        const userId = id.split("_")[2];
        const player = ensurePlayer(userId);

        player.docs.carteid = {
            nom: interaction.fields.getTextInputValue("nom"),
            prenom: interaction.fields.getTextInputValue("prenom"),
            sexe: interaction.fields.getTextInputValue("sexe"),
            naissance: interaction.fields.getTextInputValue("naissance")
        };

        saveData(data);

        return interaction.reply({
            content: "🪪 Carte d'identité créée.",
            ephemeral: true
        });
    }

    // ---------------------------------------------------------
    // 🔫 PPA
    // ---------------------------------------------------------
    if (id.startsWith("create_ppa_")) {
        const userId = id.split("_")[2];
        const player = ensurePlayer(userId);

        player.docs.ppa = {
            nom: interaction.fields.getTextInputValue("nom"),
            prenom: interaction.fields.getTextInputValue("prenom"),
            naissance: interaction.fields.getTextInputValue("naissance"),
            validation: interaction.fields.getTextInputValue("validation")
        };

        saveData(data);

        return interaction.reply({
            content: "🔫 PPA créé.",
            ephemeral: true
        });
    }

    // ---------------------------------------------------------
    // 🚗 PERMIS
    // ---------------------------------------------------------
    if (id.startsWith("create_permis_")) {
        const userId = id.split("_")[2];
        const player = ensurePlayer(userId);

        player.docs.permis = {
            nom: interaction.fields.getTextInputValue("nom"),
            prenom: interaction.fields.getTextInputValue("prenom"),
            naissance: interaction.fields.getTextInputValue("naissance"),
            validation: interaction.fields.getTextInputValue("validation"),
            points: interaction.fields.getTextInputValue("points")
        };

        saveData(data);

        return interaction.reply({
            content: "🚗 Permis créé.",
            ephemeral: true
        });
    }

    // ---------------------------------------------------------
    // 🏦 CRÉATION COMPTE BANCAIRE
    // ---------------------------------------------------------
    if (id.startsWith("create_banque_")) {
        const userId = id.split("_")[2];
        const player = ensurePlayer(userId);

        player.bank.cash = parseInt(interaction.fields.getTextInputValue("cash"));
        player.bank.solde = parseInt(interaction.fields.getTextInputValue("solde"));

        saveData(data);

        return interaction.reply({
            content: "🏦 Compte bancaire créé.",
            ephemeral: true
        });
    }

    // ---------------------------------------------------------
    // 🏦 DÉPÔT BANCAIRE
    // ---------------------------------------------------------
    if (id.startsWith("bank_depot_")) {
        const userId = id.split("_")[2];
        const player = ensurePlayer(userId);

        const montant = parseInt(interaction.fields.getTextInputValue("montant"));

        if (isNaN(montant) || montant <= 0) {
            return interaction.reply({
                content: "❌ Montant invalide.",
                ephemeral: true
            });
        }

        if (player.bank.cash < montant) {
            return interaction.reply({
                content: "❌ Pas assez de cash.",
                ephemeral: true
            });
        }

        player.bank.cash -= montant;
        player.bank.solde += montant;

        saveData(data);

        return interaction.reply({
            content: `🏦 Dépôt effectué : **+${montant}$**`,
            ephemeral: true
        });
    }

    // ---------------------------------------------------------
    // 🏦 RETRAIT BANCAIRE
    // ---------------------------------------------------------
    if (id.startsWith("bank_retrait_")) {
        const userId = id.split("_")[2];
        const player = ensurePlayer(userId);

        const montant = parseInt(interaction.fields.getTextInputValue("montant"));

        if (isNaN(montant) || montant <= 0) {
            return interaction.reply({
                content: "❌ Montant invalide.",
                ephemeral: true
            });
        }

        if (player.bank.solde < montant) {
            return interaction.reply({
                content: "❌ Solde insuffisant.",
                ephemeral: true
            });
        }

        player.bank.solde -= montant;
        player.bank.cash += montant;

        saveData(data);

        return interaction.reply({
            content: `🏦 Retrait effectué : **${montant}$**`,
            ephemeral: true
        });
    }

    // ---------------------------------------------------------
    // 💸 TRANSACTION ENTRE JOUEURS
    // ---------------------------------------------------------
    if (id.startsWith("pay_confirm_")) {
        const parts = id.split("_");
        const senderId = parts[2];
        const targetId = parts[3];

        const montant = parseInt(interaction.fields.getTextInputValue("montant"));

        const sender = ensurePlayer(senderId);
        const target = ensurePlayer(targetId);

        if (isNaN(montant) || montant <= 0) {
            return interaction.reply({
                content: "❌ Montant invalide.",
                ephemeral: true
            });
        }

        if (sender.bank.cash < montant) {
            return interaction.reply({
                content: "❌ Tu n'as pas assez de cash.",
                ephemeral: true
            });
        }

        sender.bank.cash -= montant;
        target.bank.cash += montant;

        const now = new Date().toLocaleString("fr-FR");

        sender.transactions.push({
            type: "sortant",
            montant,
            vers: targetId,
            date: now
        });

        target.transactions.push({
            type: "entrant",
            montant,
            de: senderId,
            date: now
        });

        saveData(data);

        return interaction.reply({
            content: `💸 <@${senderId}> a envoyé **${montant}$** à <@${targetId}>.`,
            ephemeral: false
        });
    }
};
