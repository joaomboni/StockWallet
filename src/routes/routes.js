require("dotenv").config();
const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller");

router.get('/hello-world', controller.helloWorld);
router.post('/api-busca', controller.consultaYahoo);
router.post('/preco-justo', controller.precoJusto);

router.get('/list-preco-justo', controller.listPrecos);
router.delete('/delete-preco-justo/:symbol', controller.deletePreco);
router.post('/create-preco-justo', controller.createPrecoJusto);

module.exports = router;
