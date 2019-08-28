const express = require("express");
const connectDB = require("./config/db");

// Se inicializa la aplicacion con express
const app = express();

// Se conecta la base de datos  con la funcion  connectDB
connectDB();

app.get("/", (req, res) => res.send("API Running"));

// Se crea la variable PORT que se encarga de escuchar si es que se esta en produccion o si no, la aplicacion se ejecuta
// en el puerto 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
