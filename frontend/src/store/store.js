import { createStore } from "redux";

const loginReducer = (state = { logged: false }, action) => {
  switch (action.type) {
    case "login":
      return { logged: true };
    case "logout":
      return { logged: false };
    default:
      return state;
  }
};

let store = createStore(loginReducer);

store.dispatch({ type: "login" });
store.dispatch({ type: "logout" });

export default store;
