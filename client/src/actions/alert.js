import { SET_ALERT, REMOVE_ALERT } from "./types";
import uuid from "uuid";

/* Se crea la accion para crear la alerta, que recibe como parametros el mensaje, el tipo y el tiempo que va a 
a aparecer                                               aqui se utiliza dispatch para que no se ponga en el componete "dispatchToProps"*/
export const setAlert = (msg, alertType, timeout = 4000) => dispatch => {
  const id = uuid.v4();
  // se hace dispatch la informacion con el tipo y el payload
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id }
  });

  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};
