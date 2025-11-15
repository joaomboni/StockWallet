require("dotenv").config();
const express = require('express')
const app = express()
const routes = require("./src/routes/routes");
const connectDB = require("./src/models/connect")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB.connect();
app.use("/api", routes);

const port = process.env.PROXY_PORT;


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
