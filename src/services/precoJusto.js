/*
Preço Justo
pj = sqrt((vpa * lpa) * 22,05)
*/
const YahooFinance = require("yahoo-finance2").default;
const yahooFinance = new YahooFinance();
const yahoo = require("./yahoo");
const db = require("../models/connect");
const funcao = require("../helpers/helper");

class precoJusto extends yahoo {

    constructor() {
        super()
    }

    async getCharts(symbol) {

        try{
            const today = new Date();
            const start = new Date();
            start.setFullYear(today.getFullYear() - 100); // Ultimos 5 anos

            const result = await yahooFinance.chart(symbol, {
                period1: start,
                period2: today,
                interval: "1d"
            });

            const quotes = result?.quotes;

            if (!quotes || quotes.length === 0) {
                return null;
            }

            // reduzindo só para o essencial
            const candles = quotes.map(q => ({
                date: q.date,
                open: q.open,
                close: q.close
            }));

            const closes = candles.map(c => c.close);
            const ema200 = funcao.EMA(closes, 200);
            const ema50 = funcao.EMA(closes, 50);

            return{
                symbol,
                candles,
                closes,
                ema200,
                ema50
            }
            // const closes = candles.map(c => c.close);
            // // Médias móveis
            // // const sma50 = funcao.SMA(closes, 50);
            // // const sma100 = funcao.SMA(closes, 100);
            //
            // return {
            //     symbol,
            //     candles,
            //     closes
            //     // sma50,
            //     // sma100,
            //     // sma200
            // };
    }catch(e) {
        console.error(e);
        }
    }

    async getTables(symbol){
        //return await this.getFundamentalsTable(symbol);
        const pj = await this.calcular(symbol);

        const fundamentals = await this.getFundamentalsTable(symbol);


        const {
            tipo, empresa,
            setor, cotacao,
            valorMercado, pl,
            pvp, psr,
            dividendYield, evEbitda,
            lpa, vpa,
            roe
        } = fundamentals;

        return {precoJusto: pj.precoJusto, fundamentals}
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
            //{upsert: true}  // cria se não existir
        );

        return {precoJusto: pj, fundamentos: fundamentals};
    }

    // -----------------------------------------
    // MÉTODO PARA RECALCULAR REGISTROS
    // -----------------------------------------
    async refreshAll() {
        const database = db.getDatabase();
        const collection = database.collection("precos");

        // busque apenas os symbols para reduzir payload
        const symbols = await collection.find({}, { projection: { _id: 0, symbol: 1 } }).toArray();
        if (!symbols.length) {
            return { processed: 0, updated: 0, errors: [] };
        }

        let updated = 0;
        const errors = [];

        // limite de concorrência simples
        const concurrency = 3;
        let i = 0;
        const work = async () => {
            while (i < symbols.length) {
                const idx = i++;
                const symbol = symbols[idx].symbol;
                try {
                    await this.calcular(symbol);
                    updated++;
                } catch (err) {
                    errors.push({ symbol, error: err.message });
                }
            }
        };

    
        await Promise.all(Array.from({ length: concurrency }, work));

        return {
            processed: symbols.length,
            updated,
            errors,
        };
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
        const media = await this.getCharts(symbol);

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
        const collection = database.collection("precos");

        // --------- LIMITE DE DOCUMENTOS ACEITO -------
        //   const total = await collection.countDocuments({});
        //   if (total => 5){
        //       throw new Error("Limite máximo de 5 registros atingido.");
        //   }


        const objRegistro = {
            symbol,
            EMA50: media.ema50.at(-1),
            EMA200: media.ema200.at(-1),
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
