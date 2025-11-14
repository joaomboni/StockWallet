require("dotenv").config();
const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller");

router.get('/hello-world', controller.helloWorld);
router.post('/api-busca', controller.consultaYahoo);

module.exports = router;
