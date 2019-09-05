import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import profileReducer from "./profileReducer";
import post from "./post";

export default combineReducers({
  alert,
  auth,
  profileReducer,
  post
});
