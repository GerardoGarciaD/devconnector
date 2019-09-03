import axios from "axios";
import { setAlert } from "./alert";
import {
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  LOGOUT,
  CLEAR_PROFILE
} from "./types";
import setAuthToken from "../utils/setAuthToken";

//Obtener y cargar usuario
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    // Funcion para añadir x-auth-token y el valor del token a los headers para que se pueda obtener la informacion del token
    setAuthToken(localStorage.token);
  }

  try {
    // Se hace el llamado a la ruta del servidor en donde el token ya esta en los headers y en esa ruta
    // de desencripta la informacion del usuario
    const res = await axios.get("/api/auth");

    // se envia la accion en donde en el payload se recibe la informacion desencriptada del usuario
    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({ type: AUTH_ERROR });
  }
};

// Registrar usuario
export const register = ({ name, email, password }) => async dispatch => {
  // Se realiza la configuracion inicial para saber que tipo se datos se van a mandar al servidor
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  // Se crea un Json con la informacion que se pasa como parametro a la accion
  const body = JSON.stringify({ name, email, password });

  try {
    // despues se hace el llamado a la ruta del servidor, se pasa el cuerpo del req y la configuracion
    const res = await axios.post("/api/users", body, config);

    // Se envia la accion con la respuesta del servidor que en este caso es el token con la informacion encryptada
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: REGISTER_FAILURE
    });
  }
};

// Iniciar sesion del usuario
export const login = (email, password) => async dispatch => {
  // Se realiza la configuracion inicial para saber que tipo se datos se van a mandar al servidor
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  // Se crea un Json con la informacion que se pasa como parametro a la accion
  const body = JSON.stringify({ email, password });

  try {
    // despues se hace el llamado a la ruta del servidor, se pasa el cuerpo del req y la configuracion
    const res = await axios.post("/api/auth", body, config);

    // Se se envia el type y la respuesta, que en este caso es el token encriptado con la informacion del usuario
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: LOGIN_FAILURE
    });
  }
};

// Logout / quitar el perfil (token) de la memoria local
export const logout = () => dispatch => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
};
