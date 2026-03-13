const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "..", "data", "joueurs.json");

function loadData() {
    if (!fs.existsSync(DATA_PATH)) return {};
    const raw = fs.readFileSync(DATA_PATH, "utf8");
    if (!raw.trim()) return {};
    return JSON.parse(raw);
}

function saveData(data) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf8");
}

function getPlayer(data, userId) {
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
            photo: null
        };
    }
    return data[userId];
}

module.exports = { loadData, saveData, getPlayer };
