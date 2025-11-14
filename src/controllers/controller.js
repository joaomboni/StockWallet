// Controllers
const yahoo = require("../services/yahoo");

// Note: Express handlers receive (req, res)
const helloWorld = async (req, res) => {
  res.send('Hello World!');
};

const consultaYahoo = async (req, res) => {
  try {
    const { symbol } = req.query;
    const yh = new yahoo();
    const result = await yh.fetchFundamentals(symbol);
    res.json({ symbol, ...result });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || 'Erro ao consultar Yahoo Finance' });
  }
}

const controller = {
  helloWorld,
  consultaYahoo,
};

module.exports = controller;