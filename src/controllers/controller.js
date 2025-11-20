// Controllers
const yahoo = require("../services/yahoo");
const PrecoJusto = require("../services/precoJusto");
const db = require("../models/connect");

// Note: Express handlers receive (req, res)
const helloWorld = async (req, res) => {
  res.render('home');
};

const consultaYahoo = async (req, res) => {
  try {
    const symbol = req.body?.symbol || req.query?.symbol;
    const yh = new yahoo();
    const result = await yh.fetchFundamentals(symbol);
    res.status(200).json({ symbol, ...result });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || 'Erro ao consultar Yahoo Finance' });
  }
}

const getFundamentalsTable = async (req, res) => {
    try{
        const symbol = req.body?.symbol || req.query?.symbol;
        const pj = new PrecoJusto();
        const result = await pj.getTables(symbol);
        res.status(200).json({ symbol, ...result });
    }catch(err){
        console.error(err);
        res.status(400).json({ error: err.message || 'Erro ao getFundamentalsTable' });
    }
}

const updatePrecoJusto = async (req, res) =>{
  try {
    const symbol  = req.body?.symbol || req.query?.symbol;
    if(!symbol){
        return res.status(400).json({error: "No symbol existe"});
    }
    const pj = new PrecoJusto();
    const result = await pj.calcular(symbol);
    res.status(200).json({ symbol, ...result });
  } catch (err) {
    console.error(err);
      const code = err.code === 11000 ? 409 : 400;
    res.status(code).json({ error: err.message || 'Erro ao calcular Preço Justo' });
  }
}

const refreshAll = async (req, res) => {
    try {
        const pj = new PrecoJusto();
        const result = await pj.recalcularTodos();
        // 207 Multi-Status é outra opção; 200 aqui com resumo é suficiente
        return res.status(200).json(result);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'Erro ao atualizar todos os preços' });
    }
};


const listPrecos = async (req, res) => {
    try {
        const database = db.getDatabase();
        const collection = database.collection("precos");

        const symbol = req.body?.symbol || req.query?.symbol; // aceita query ou body

        if (symbol) {
            // Retorna apenas o documento do symbol informado
            const doc = await collection.findOne({ symbol });
            if (!doc) {
                return res.status(404).json({ error: `Nenhum registro encontrado para symbol: ${symbol}` });
            }
            return res.status(200).json(doc);
        }
        // Listar os documentos, mais recentes primeiro; ajuste conforme preferir
        const docs = await collection
            .find({})
            .sort({ createdAt: -1 })
            .limit(6)
            .toArray();

        res.status(200).json(docs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message || "Erro ao listar preços" });
    }
};

const createPrecoJusto = async (req, res) => {
    try {
        const symbol  = req.body?.symbol || req.query?.symbol;
        if(!symbol){
            return res.status(400).json({error: "No symbol existe"});
        }
        const pj = new PrecoJusto();
        const result = await pj.calcularCreatePrecoJusto(symbol);
        res.status(201).json({ symbol, ...result });
    } catch (err) {
        console.error(err);
        const code = err.code === 11000 ? 409 : 400;
        res.status(code).json({ error: err.message || 'Erro ao calcular Preço Justo' });
    }
}

const deletePreco = async(req, res) => {
    try {
        const symbol = req.params?.symbol || req.query?.symbol;
        if(!symbol){
            return res.status(400).json({error: "No symbol existe"});
        }
        const pj = new PrecoJusto();
        const result = await pj.deleteBySymbol(symbol);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const controller = {
    helloWorld,
    consultaYahoo,
    getFundamentalsTable,
    updatePrecoJusto,
    createPrecoJusto,
    deletePreco,
    listPrecos,
    refreshAll,
};

module.exports = controller;