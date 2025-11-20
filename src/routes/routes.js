require("dotenv").config();
const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller");

router.get('/hello-world', controller.helloWorld);
router.post('/api-busca', controller.consultaYahoo);

router.post('/update-preco-justo', controller.updatePrecoJusto);
router.post('/create-preco-justo', controller.createPrecoJusto);
router.get('/list-preco-justo', controller.listPrecos);
router.delete('/delete-preco-justo/:symbol', controller.deletePreco);
router.post('/refresh-precos', controller.refreshAll);

// TABELA
router.post('/fundamentals', controller.getFundamentalsTable);

module.exports = router;
