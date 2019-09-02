import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import rootReducer from "./reducers";

const initialState = {};

// Se crea la variable que contendrá todos los midleware que se vayan a utilizar en el proyecto
const middleware = [thunk];

// Se crea el store, que toma como parametros el rootReducer, el initialState y los middlewares
const store = createStore(
  rootReducer,
  initialState,
  //   como queremos ver de una forma mas "bonita" las acciones, se implementa composeWithDevTools
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
