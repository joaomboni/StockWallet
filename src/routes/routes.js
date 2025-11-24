require("dotenv").config();
const express = require("express");
const cron = require('node-cron');
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

//Grafico
router.post('/getCharts', controller.getcharts);


//Cronjob
const job = cron.schedule('* 11 * * *', async () => {
    try{
        //res.status(200).json({message: "Iniciando o cron job de atualização de preços..."});
        const refresh = await controller.refreshAll();
        console.log(`Refresh concluído às ${new Date().toLocaleTimeString()} : ${refresh}`);
    }catch(e){
        console.error("Erro no cron job:", e);
    }
});

// Iniciar a execução do cron job
job.start();


module.exports = router;
