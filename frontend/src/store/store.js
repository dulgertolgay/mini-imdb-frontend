import { createStore } from "redux";

const loginReducer = (state = { logged: false, user: null }, action) => {
  switch (action.type) {
    case "login":
      return { logged: true };
    case "logout":
      return { logged: false };
    case "setUser":
      return { logged: true, user: action.payload };
    default:
      return state;
  }
};

let store = createStore(loginReducer);

store.dispatch({ type: "login" });
store.dispatch({ type: "logout" });
store.dispatch({ type: "setUser" });

export default store;
