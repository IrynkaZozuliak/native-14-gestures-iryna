
import "react-native-gesture-handler";

import { Provider } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import store from "./store";
import MainNavigator from "./navigators/MainNavigator";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <MainNavigator />
      </Provider>
    </GestureHandlerRootView>
  );
}
