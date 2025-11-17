/*
Preço Justo
pj = sqrt((vpa * lpa) * 22,05)
*/

const yahoo = require("./yahoo");
const db = require("../models/connect");

class precoJusto extends yahoo {

    constructor() {
        super()
    }

    async calcular(symbol) {

        //const yh = new yahoo();
        const fundamentals = await this.fetchFundamentals(symbol);

        const {vpa, lpa} = fundamentals;

        if (vpa === null || lpa === null) {
            throw new Error("Dados insuficientes para calcular o Preço Justo");
        }

        // ------------------------
        // CALCULO DO PREÇO JUSTO
        // ------------------------

        const pj = Math.sqrt(vpa * lpa * 22.05);
        //return { precoJusto: pj, fundamentos: fundamentals };


        // ------------------------------
        // SALVAR / ATUALIZAR NO MONGO
        // ------------------------------
        const database = db.getDatabase();
        const collection = database.collection("precos");

        // --------- LIMITE DE DOCUMENTOS ACEITO -------
        //   const total = await collection.countDocuments({});
        //   if (total => 5){
        //       throw new Error("Limite máximo de 5 registros atingido.");
        //   }

        await collection.updateOne(
            {symbol},   // filtro: procurar pelo símbolo(ticker)
            {
                $set: {
                    symbol,
                    precoJusto: pj,
                    updatedAt: new Date(),
                    fundamentos: fundamentals
                }
            },
            {upsert: true}  // cria se não existir
        );

        return {precoJusto: pj, fundamentos: fundamentals};
    }

    // -----------------------------------------
    // MÉTODO PARA EXCLUIR REGISTRO POR SYMBOL
    // -----------------------------------------
    async deleteBySymbol(symbol) {
        if (!symbol) {
            throw new Error("É necessário informar um symbol para deletar.");
        }

        const database = db.getDatabase();
        const collection = database.collection("precos");

        const result = await collection.deleteOne({symbol});

        if (result.deletedCount === 0) {
            throw new Error(`Nenhum registro encontrado com o symbol: ${symbol}`);
        }

        return {message: `Registro com symbol ${symbol} deletado com sucesso.`};
    }

    // -----------------------------------------
    // MÉTODO PARA CRIAR REGISTRO POR SYMBOL
    // -----------------------------------------

    async calcularCreatePrecoJusto(symbol) {

        //const yh = new yahoo();
        const fundamentals = await this.fetchFundamentals(symbol);

        const {vpa, lpa} = fundamentals;

        if (vpa === null || lpa === null) {
            throw new Error("Dados insuficientes para calcular o Preço Justo");
        }

        // ------------------------
        // CALCULO DO PREÇO JUSTO
        // ------------------------

        const pj = Math.sqrt(vpa * lpa * 22.05);
        //return { precoJusto: pj, fundamentos: fundamentals };


        // ------------------------------
        // CRIA REGISTRO NOMONGO
        // ------------------------------
        const database = db.getDatabase();
        const collection = database.collection("preco-justo");

        // --------- LIMITE DE DOCUMENTOS ACEITO -------
        //   const total = await collection.countDocuments({});
        //   if (total => 5){
        //       throw new Error("Limite máximo de 5 registros atingido.");
        //   }


        const objRegistro = {
            symbol,
            precoJusto: pj,
            fundamentos: fundamentals,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        try {
            const result = await collection.insertOne(objRegistro);
            return {_id: result.insertedId, ...objRegistro};
        } catch (err) {
            if (err.code === 11000) {
                // requer índice único em symbol
                throw new Error("Já existe um registro com este symbol");
            }
            throw err;
        }
    }
}

module.exports = precoJusto;