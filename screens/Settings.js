import { StyleSheet, Switch } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
  useAnimatedProps,
  interpolateColor,
} from "react-native-reanimated";

import { themeActions } from "../store/themeSlice";
import { COLORS_LIGHT, COLORS_DARK } from "../constants";

const AnimatedSwitch = Animated.createAnimatedComponent(Switch)

function Settings() {
  const dispatch = useDispatch();
  const colors = useSelector((state) => state.theme.colors);
  const isDark = useSelector((state) => state.theme.isDark);

  const progress = useDerivedValue(() => {
    return isDark
      ? withTiming(1, { duration: 1000 })
      : withTiming(0, { duration: 1000 });
  }, [isDark]);

  const styles = useMemo(() => getStyles(colors), [colors]);

  const animatedSwitchProps = useAnimatedProps(() => {
    const trackColor = interpolateColor(
      progress.value,
      [0, 1],
      [COLORS_LIGHT.primary300, COLORS_DARK.primary300]
    );
    const thumbColor = interpolateColor(
      progress.value,
      [0, 1],
      [COLORS_LIGHT.primary900, COLORS_DARK.primary900]
    );
    return {
      trackColor,
      thumbColor,
    };
  });

  const rTextColorStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      [COLORS_LIGHT.fontMain, COLORS_DARK.fontMain]
    );

    return { color };
  });
  const rBackgroundColorStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [COLORS_LIGHT.appBackground, COLORS_DARK.appBackground]
    );

    return { backgroundColor };
  });

  return (
    <Animated.View style={[styles.container, rBackgroundColorStyle]}>
      <Animated.Text style={[styles.caption, rTextColorStyle]}>
        Choose color theme:
      </Animated.Text>
      <Animated.View style={[styles.switchContainer, rBackgroundColorStyle]}>
        <Animated.Text style={[styles.caption, rTextColorStyle]}>
          Light
        </Animated.Text>
        <AnimatedSwitch
          animatedProps={animatedSwitchProps}
          ios_backgroundColor={colors.primary200}
          onValueChange={() => dispatch(themeActions.toggle())}
          value={isDark}
          style={{ transform: [{ scaleX: 2 }, { scaleY: 2 }] }}
        />
        <Animated.Text style={[styles.caption, rTextColorStyle]}>
          Dark
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.appBackground,
    },
    switchContainer: {
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      marginBottom: 100,
    },
    caption: {
      fontSize: 18,
      margin: 30,
      color: colors.fontMain,
    },
  });
}

export default Settings;
