import axios from "axios";

// Esta funcion permite verificar si existe el token para registrar e iniciar sesion de los usuarios
// y añadirlo a los headers y obtener la informacion del usuario
const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common["x-auth-token"] = token;
  } else {
    delete axios.defaults.headers.common["x-auth-token"];
  }
};

export default setAuthToken;
