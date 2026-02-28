import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import authReducer from "./reducers/authReducer";

const rootReducer = combineReducers({
  auth: authReducer,
});

const store = createStore(rootReducer);

export default store;
