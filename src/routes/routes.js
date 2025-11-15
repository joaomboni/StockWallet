require("dotenv").config();
const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller");

router.get('/hello-world', controller.helloWorld);
router.post('/api-busca', controller.consultaYahoo);
router.post('/preco-justo', controller.precoJusto);
router.delete('/delete', controller.deletePreco);

module.exports = router;
