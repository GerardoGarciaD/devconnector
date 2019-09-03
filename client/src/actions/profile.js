import axios from "axios";
import { setAlert } from "./alert";
import { PROFILE_ERROR, GET_PROFILE } from "./types";

// Obtener el usuario actual/logueado
export const getCurrentProfile = () => async dispatch => {
  try {
    // Se obtiene el perfil del usuario logueado llamando a la ruta del server
    const res = await axios.get("/api/profile/me");
    console.log(res);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    /* dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    }); */
    console.log(err);
  }
};

// Crear o actualizar perfil

export const createProfile = (
  formData,
  history,
  edit = false
) => async dispatch => {
  try {
    // Se crea la variable en donde se configura que tipo de datos se van a enviar al server
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    // Se realiza la peticion a la ruta del server con axios
    const res = await axios.post("/api/profile", formData, config);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });

    // Alerta personalizada dependiendo del valor de "edit"
    dispatch(setAlert(edit ? "Profile Updated" : "Profile Created", "success"));

    // Si el valor de edit es falso y el perfil del usuario acaba de ser creado, entonces se redirecciona a dashboar con el metodo history
    if (!edit) {
      history.push("/dashboard");
    }
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
