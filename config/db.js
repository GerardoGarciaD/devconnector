const mongoose = require("mongoose");
const config = require("config");
// Se obtiene la direccion para de la base de datos
const db = config.get("mongoURI");

// Se crea una funcion asyncrona que se encarga de conectar la base de datos
const connectDB = async () => {
  try {
    // Como es una funcion async, se utiliza await para que se espera hasta que esta accion termine para poder continuar
    await mongoose.connect(db, { useNewUrlParser: true });
    console.log("Mongo db Connected");
  } catch (err) {
    console.log(err.message);
    //Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
