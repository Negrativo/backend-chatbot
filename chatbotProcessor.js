import pkg from "pg";
import cron from "node-cron";
import fs from 'fs/promises';

const { Client } = pkg;

const client = new Client({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    ssl: false,
});

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Conectado ao banco de dados com sucesso!");
    } catch (err) {
        console.error("Erro ao conectar ao banco de dados:", err);
    }
}

function decodeUnicodeEscapes(text) {
    try {
        return Buffer.from(text, 'utf8').toString();
    } catch (err) {
        console.error("Erro ao decodificar:", err);
        return text;
    }
}

async function extractData(row) {
    try {
        const data = JSON.parse(row.data);
        if (["user", "bot"].includes(row.type_name)) {
            return {
                type_name: row.type_name,
                text: decodeUnicodeEscapes(data.text || ""),
                timestamp: data.timestamp,
            };
        } else if (row.type_name === "slot") {
            const slot_name = data.name;
            const slot_value = data.value;
            if (slot_name === "requested_slot" || slot_value == null) {
                return null;
            }
            return {
                type_name: row.type_name,
                slot_name: slot_name,
                slot_value: slot_value,
                timestamp: data.timestamp,
            };
        }
    } catch (err) {
        console.error("Erro ao extrair dados:", err);
        return null;
    }
}

async function checkIfSenderIdExists(sender_id) {
    try {
        const res = await client.query(
            "SELECT EXISTS(SELECT 1 FROM conversations WHERE sender_id = $1)",
            [sender_id]
        );
        return res.rows[0].exists;
    } catch (err) {
        console.error(`Erro ao verificar se o sender_id ${sender_id} existe:`, err);
        return false;
    }
}

async function loadLastSlotStatistics() {
    try {
        await fs.access('slot_statistics.json');
        const data = await fs.readFile('slot_statistics.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log("Arquivo 'slot_statistics.json' não encontrado. Criando um novo arquivo.");
            const initialData = {};
            await saveSlotStatistics(initialData);
            return initialData;
        } else {
            console.error("Erro ao carregar as últimas estatísticas de slots:", err);
            return {};
        }
    }
}

async function saveSlotStatistics(statistics) {
    try {
        await fs.writeFile('slot_statistics.json', JSON.stringify(statistics, null, 2), 'utf8');
        console.log("Estatísticas de slots salvas com sucesso.");
    } catch (err) {
        console.error("Erro ao salvar as estatísticas de slots:", err);
    }
}

export async function processChatbotData() {
    try {
        let slotStatistics = await loadLastSlotStatistics();

        const res = await client.query(
            "SELECT sender_id, type_name, data FROM events WHERE type_name IN ($1, $2, $3)",
            ["user", "bot", "slot"]
        );
        const rows = res.rows;

        const sessionData = {};

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];

            const senderIdExists = await checkIfSenderIdExists(row.sender_id);
            if (senderIdExists) continue;

            const extractedData = await extractData(row);
            if (!extractedData) continue;

            if (!sessionData[row.sender_id]) {
                sessionData[row.sender_id] = {
                    messages: [],
                    slots: {},
                };
            }

            if (["user", "bot"].includes(row.type_name)) {
                sessionData[row.sender_id].messages.push(extractedData);
            } else if (row.type_name === "slot") {
                const slotName = extractedData.slot_name;
                if (!sessionData[row.sender_id].slots[slotName]) {
                    sessionData[row.sender_id].slots[slotName] = [];
                }
                if (!sessionData[row.sender_id].slots[slotName].includes(extractedData.slot_value)) {
                    sessionData[row.sender_id].slots[slotName].push(extractedData.slot_value);
                }
            }
        }

        for (const sessionId in sessionData) {
            sessionData[sessionId].messages.sort((a, b) => a.timestamp - b.timestamp);
            for (const slotName in sessionData[sessionId].slots) {
                if (!slotStatistics[slotName]) {
                    slotStatistics[slotName] = 0;
                }
                slotStatistics[slotName] += sessionData[sessionId].slots[slotName].length;
            }

            await client.query(
                "INSERT INTO conversations (sender_id, conversation_data) VALUES ($1, $2) ON CONFLICT (sender_id) DO NOTHING",
                [
                    sessionId,
                    JSON.stringify({
                        messages: sessionData[sessionId].messages,
                    })
                ]
            );
        }

        await saveSlotStatistics(slotStatistics);

        console.log("Dados processados e atualizados com sucesso");
    } catch (err) {
        console.error("Erro ao processar dados:", err);
    }
}

async function main() {
    await connectToDatabase();

    cron.schedule("*/10 * * * * *", () => {
        console.log("Executando o script de processamento...");
        processChatbotData().catch((err) => {
            console.error("Erro ao processar dados:", err);
        });
    });
}

main();