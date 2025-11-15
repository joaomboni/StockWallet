/*
Conxão com o banco de dados MongoDB
*/
require('dotenv').config();
const { MongoClient } = require("mongodb");

class ConnectDB {
    constructor() {
        // Implementar a conexão com o MongoDB aqui
        this.mongoURI = process.env.MONGO_URI
        this.client = new MongoClient(this.mongoURI);
        this.dbName = process.env.MONGO_DB;
        this.db = null;
    }

    async connect() {
        try {
            if (!this.client.topology || this.client.topology.isConnected() === false) {
                await this.client.connect();
                console.log("📦 MongoDB conectado com sucesso!");
            }

            this.db = this.client.db(this.dbName);
            return this.db;

        } catch (error) {
            console.error("❌ Erro ao conectar ao MongoDB:", error.message);
            process.exit(1);
        }
    }

    getDatabase() {
        if (!this.db) {
            throw new Error("Banco de dados não conectado. Chame connect() primeiro.");
        }
        return this.db;
    }
}

module.exports = new ConnectDB();