const { loadData, saveData } = require("./data");

module.exports.handleBraquageSelect = async function (interaction) {
    const data = loadData();
    const id = interaction.values[0];
    const userId = interaction.user.id;

    const braquage = data.braquages.find(b => b.id === id);
    if (!braquage) {
        return interaction.reply({
            content: "❌ Ce braquage n'existe plus.",
            ephemeral: true
        });
    }

    const now = Date.now();

    // Cooldown
    if (now - braquage.lastUse < braquage.cooldown * 1000) {
        const restant = Math.ceil((braquage.cooldown * 1000 - (now - braquage.lastUse)) / 1000);
        return interaction.reply({
            content: `⏳ Ce braquage sera disponible dans **${restant}s**.`,
            ephemeral: true
        });
    }

    braquage.lastUse = now;
    saveData(data);

    await interaction.reply({
        content: `🔫 Tu commences le braquage **${braquage.nom}**...\n⏳ Attente : **${braquage.attente}s**`,
        ephemeral: false
    });

    // Attente
    setTimeout(() => {
        const player = data[userId];
        if (!player) return;

        player.bank.solde += braquage.gain;
        saveData(data);

        interaction.followUp({
            content: `💰 Braquage réussi ! Tu gagnes **${braquage.gain}$** (déposé en banque).`,
            ephemeral: false
        });

    }, braquage.attente * 1000);
};
