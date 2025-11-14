require("dotenv").config();
const express = require('express')
const app = express()
const routes = require("./src/routes/routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes);

const port = process.env.PROXY_PORT;


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
