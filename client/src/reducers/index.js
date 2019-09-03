import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import profileReducer from "./profileReducer";

export default combineReducers({
  alert,
  auth,
  profileReducer
});
