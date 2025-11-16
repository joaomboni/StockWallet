require("dotenv").config();
const express = require('express')
const app = express()
const routes = require("./src/routes/routes");
const connectDB = require("./src/models/connect")

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'src', 'public')));
connectDB.connect();
app.use("/api", routes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


const port = process.env.PROXY_PORT;


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
