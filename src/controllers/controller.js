// Controllers
const yahoo = require("../services/yahoo");
const PrecoJusto = require("../services/precoJusto");

// Note: Express handlers receive (req, res)
const helloWorld = async (req, res) => {
  res.send('Hello World!');
};

const consultaYahoo = async (req, res) => {
  try {
    const { symbol } = req.query;
    const yh = new yahoo();
    const result = await yh.fetchFundamentals(symbol);
    res.status(200).json({ symbol, ...result });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || 'Erro ao consultar Yahoo Finance' });
  }
}

const precoJusto = async (req, res) =>{
  try {
    const { symbol } = req.query;
    const pj = new PrecoJusto();
    const result = await pj.calcular(symbol);
    res.status(200).json({ symbol, ...result });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || 'Erro ao calcular Preço Justo' });
  }
}

const controller = {
  helloWorld,
  consultaYahoo,
  precoJusto,
};

module.exports = controller;