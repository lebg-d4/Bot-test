const fs = require("fs");
const path = require("path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();

// ---------------------------------------------------------
// CHARGEMENT DES COMMANDES
// ---------------------------------------------------------
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

// ---------------------------------------------------------
// INTERACTION HANDLER
// ---------------------------------------------------------
client.on("interactionCreate", async interaction => {

    // ---------------- SLASH COMMANDS ----------------
    if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            return interaction.reply({
                content: "❌ Une erreur est survenue lors de l'exécution de la commande.",
                flags: 64
            });
        }
    }

    // ---------------- MODALS ----------------
    if (interaction.isModalSubmit()) {
        try {
            return require("./utils/modals").handleModal(interaction);
        } catch (error) {
            console.error(error);
            return interaction.reply({
                content: "❌ Erreur lors du traitement du formulaire.",
                flags: 64
            });
        }
    }

    // ---------------- BUTTONS ----------------
    if (interaction.isButton()) {
        const id = interaction.customId;

        // DOCUMENTS
        if (id.startsWith("doc:")) {
            return require("./utils/documents").handleDocumentButtons(interaction);
        }

        // AFFICHAGE PUBLIC
        if (id.startsWith("public:")) {
            return require("./utils/documents").handlePublicDocument(interaction);
        }

        // BANQUE
        if (id.startsWith("bank:")) {
            return require("./utils/bank").handleBankButtons(interaction);
        }

        // SHOP (catégories)
        if (id.startsWith("shop:")) {
            return require("./utils/shop").handleShopButtons(interaction);
        }

        // SHOP (achat)
        if (id.startsWith("shopbuy:")) {
            return require("./utils/shop").handleShopButtons(interaction);
        }

        // ACTIONS RP
        if (id.startsWith("action:")) {
            return require("./utils/action").handleActionButtons(interaction);
        }

        // BRAQUAGES (boutons futurs)
        if (id.startsWith("braquage:")) {
            return require("./utils/braquages").handleBraquageButtons(interaction);
        }
    }

    // ---------------- SELECT MENUS ----------------
    if (interaction.isStringSelectMenu()) {
        const id = interaction.customId;

        // BRAQUAGES
        if (id === "selectBraquage") {
            return require("./utils/braquages").handleBraquageSelect(interaction);
        }
    }
});

// ---------------------------------------------------------
// BOT READY
// ---------------------------------------------------------
client.once("clientReady", () => {
    console.log(`✅ Connecté en tant que ${client.user.tag}`);
});

client.login(token);
