/*
Preço Justo
pj = sqrt((vpa * lpa) * 22,05)
*/

const yahoo = require("./yahoo");
const db = require("../models/connect");

class precoJusto extends yahoo{

    constructor() {
        super()
    }

  async calcular(symbol) {

    //const yh = new yahoo();
    const fundamentals = await this.fetchFundamentals(symbol);

    const { vpa, lpa } = fundamentals;

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

    await collection.updateOne(
        { symbol },   // filtro: procurar pelo símbolo(ticker)
        { 
            $set: { 
                symbol,
                precoJusto: pj,
                updatedAt: new Date(),
                fundamentos: fundamentals
            }
        },
        { upsert: true }  // cria se não existir
    );

    return { precoJusto: pj, fundamentos: fundamentals };
  }
}

module.exports = precoJusto;