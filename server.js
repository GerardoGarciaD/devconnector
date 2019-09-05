const express = require("express");
const connectDB = require("./config/db");
const path = require("path");

// Se inicializa la aplicacion con express
const app = express();

// Se conecta la base de datos  con la funcion  connectDB
connectDB();

// Inicializar Middleware Bodyparser

app.use(express.json({ extended: false }));

// Definir rutas
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

if (process.env.NODE_ENV === "production") {
  // Seleccionar el folder por default
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname), client, build, "index.html");
  });
}

// Se crea la variable PORT que se encarga de escuchar si es que se esta en produccion o si no, la aplicacion se ejecuta
// en el puerto 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
