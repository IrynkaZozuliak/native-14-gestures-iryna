import "react-native-gesture-handler";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useDispatch } from "react-redux";
import WordsNavigation from "./WordsNavigation";
import LearningNavigation from "./LearningNavigation";
import Settings from "../screens/Settings";
import { StatusBar } from "react-native";
import { wordsLearningActions } from "../store/wordsLearningSlice";
import { themeActions } from "../store/themeSlice";
import { REFRESH_STATUSES_SPAN } from "../constants";
import * as dbUtils from "../store/dbUtils";

const Tab = createBottomTabNavigator();

function MainNavigator() {
  const colors = useSelector((state) => state.theme.colors);
  const isDark = useSelector((state) => state.theme.isDark);
  const [isInitialized, setIsIninialized] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dbUtils
      .init()
      .then(dbUtils.getWords)
      .then((result) => {
        dispatch(wordsLearningActions.setInitial(result));
      })
      .then(dbUtils.getTheme)
      .then((result) => dispatch(themeActions.setInitial(result)))
      .then(() => setIsIninialized(true));

    const interval = setInterval(
      () => dispatch(wordsLearningActions.updateStatuses()),
      REFRESH_STATUSES_SPAN
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <StatusBar
        backgroundColor={colors.appBackground}
        barStyle={isDark ? "light-content" : "dark-content"}
      />
      {isInitialized && (
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              tabBarHideOnKeyboard: true,
              headerTitleStyle: { fontWeight: "800" },
              tabBarActiveTintColor: colors.primary900,
              tabBarActiveBackgroundColor: colors.appBackground,
              tabBarInactiveBackgroundColor: colors.appBackground,
              headerStyle: {
                backgroundColor: colors.appBackground,
              },
              headerTintColor: colors.primary900,
              headerTitleAlign: "center",
            }}
          >
            <Tab.Screen
              name="Words"
              options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="list-outline" size={size} color={color} />
                ),
              }}
              component={WordsNavigation}
            />
            <Tab.Screen
              name="Learning"
              component={LearningNavigation}
              options={{
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="book-outline" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Settings"
              component={Settings}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="settings-outline" size={size} color={color} />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      )}
    </>
  );
}

export default MainNavigator;
