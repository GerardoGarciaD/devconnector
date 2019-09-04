import axios from "axios";
import { setAlert } from "./alert";
import {
  PROFILE_ERROR,
  GET_PROFILE,
  UPDATE_PROFILE,
  ACCOUNT_DELETED
} from "./types";

// Obtener el usuario actual/logueado
export const getCurrentProfile = () => async dispatch => {
  try {
    // Se obtiene el perfil del usuario logueado llamando a la ruta del server
    const res = await axios.get("/api/profile/me");
    // console.log(res);

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
    // console.log(err);
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

// Añadir experiencia

export const addExperience = (formData, history) => async dispatch => {
  try {
    // Se crea la variable en donde se configura que tipo de datos se van a enviar al server
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    // Se realiza la peticion a la ruta del server con axios
    const res = await axios.put("/api/profile/experience", formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert("Experience Added", "success"));

    history.push("/dashboard");
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

// Añadir educacion

export const addEducation = (formData, history) => async dispatch => {
  try {
    // Se crea la variable en donde se configura que tipo de datos se van a enviar al server
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    // Se realiza la peticion a la ruta del server con axios
    const res = await axios.put("/api/profile/education", formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert("Education Added", "success"));

    history.push("/dashboard");
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

// Eliminar experiencia laboral
export const deleteExperience = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/experience/${id}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert("Experience Removed", "success"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Eliminar historial accademico

export const deleteEducation = id => async dispatch => {
  try {
    const res = await axios.delete(`/api/profile/education/${id}`);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data
    });

    dispatch(setAlert("Education Removed", "success"));
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Eliminar cuenta y perfil

export const deleteAccount = () => async dispatch => {
  if (window.confirm("Are you sure? This can NOT be undone!")) {
    try {
      const res = await axios.delete(`/api/profile`);

      dispatch({
        type: ACCOUNT_DELETED
      });
      dispatch({
        type: UPDATE_PROFILE
      });

      dispatch(setAlert("Your account has been permenantly deleted"));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: {
          msg: err.res.data.statusText,
          status: err.res.data.status
        }
      });
    }
  }
};
