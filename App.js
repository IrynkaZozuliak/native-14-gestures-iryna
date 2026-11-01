import "react-native-gesture-handler";
import { Provider } from "react-redux";

import store from "./store";
import MainNavigator from "./navigators/MainNavigator";

export default function App() {

  return (
    <>
      <Provider store={store}>
        <MainNavigator />
      </Provider>
    </>
  );
}
