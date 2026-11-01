
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  useWindowDimensions,
} from "react-native";
import { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { wordsLearningActions } from "../store/wordsLearningSlice";
import { playSound } from "../services/soundHandler";

const SWIPE_THRESHOLD_DIVISOR = 2.3;
const ANIMATION_DURATION = 550;
const DOWNWARD_MOVEMENT = 0.22;

function WordCard({ wordInfo, setNext }) {
  const [showFullInfo, setShowFullInfo] = useState(false);
  const [canSwipe, setCanSwipe] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const colors = useSelector((state) => state.theme.colors);
  const styles = useMemo(() => getStyles(colors), [colors]);

  const dispatch = useDispatch();

  const {
    width: screenWidth,
    height: screenHeight,
  } = useWindowDimensions();

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotateY = useSharedValue(0);

  const swipeThreshold = screenWidth / SWIPE_THRESHOLD_DIVISOR;

  // Поворот картки для відображення повної інформації.
  const flipCard = () => {
    if (showFullInfo || isAnimatingOut) return;

    setShowFullInfo(true);

    rotateY.value = withTiming(
      180,
      { duration: 450 },
      (finished) => {
        if (finished) {
          runOnJS(setCanSwipe)(true);
        }
      }
    );
  };

  // Перехід до наступної картки після анімації.
  const handleSwipe = (direction) => {
    if (direction === "right") {
      dispatch(
        wordsLearningActions.updateWordLearnInfo(wordInfo.word)
      );
    }

    setNext();
  };

  // Плавне переміщення картки по діагоналі.
  const animateCardOut = (direction) => {
    if (isAnimatingOut) return;

    setIsAnimatingOut(true);

    const destinationX =
      direction === "right"
        ? screenWidth * 1.5
        : -screenWidth * 1.5;

    // Картка також рухається вниз.
    const destinationY = screenHeight * DOWNWARD_MOVEMENT;

    translateX.value = withTiming(
      destinationX,
      { duration: ANIMATION_DURATION }
    );

    translateY.value = withTiming(
      destinationY,
      { duration: ANIMATION_DURATION },
      (finished) => {
        if (finished) {
          runOnJS(handleSwipe)(direction);
        }
      }
    );
  };

  // Кнопка Knew it — рух вправо-вниз.
  const handleKnewIt = () => {
    animateCardOut("right");
  };

  // Кнопка Didn't know it — рух вліво-вниз.
  const handleDidntKnowIt = () => {
    animateCardOut("left");
  };

  // Горизонтальний жест переміщення картки.
  const panGesture = Gesture.Pan()
    .enabled(canSwipe && !isAnimatingOut)
    .onUpdate((event) => {
      translateX.value = event.translationX;

      // Додаємо невелике переміщення вниз
      // залежно від горизонтального руху пальця.
      translateY.value =
        Math.max(0, Math.abs(event.translationX) * DOWNWARD_MOVEMENT) +
        Math.max(0, event.translationY);
    })
    .onEnd((event) => {
      // Недостатньо сильний свайп — повертаємо картку.
      if (Math.abs(event.translationX) < swipeThreshold) {
        translateX.value = withSpring(0, {
          damping: 16,
          stiffness: 140,
        });

        translateY.value = withSpring(0, {
          damping: 16,
          stiffness: 140,
        });

        return;
      }

      const direction =
        event.translationX > 0 ? "right" : "left";

      runOnJS(setIsAnimatingOut)(true);

      const destinationX =
        direction === "right"
          ? screenWidth * 1.5
          : -screenWidth * 1.5;

      const destinationY = screenHeight * DOWNWARD_MOVEMENT;

      translateX.value = withTiming(
        destinationX,
        { duration: ANIMATION_DURATION }
      );

      translateY.value = withTiming(
        destinationY,
        { duration: ANIMATION_DURATION },
        (finished) => {
          if (finished) {
            runOnJS(handleSwipe)(direction);
          }
        }
      );
    });

  // Анімація переміщення та нахилу картки.
  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      {
        rotateZ: `${interpolate(
          translateX.value,
          [-screenWidth, 0, screenWidth],
          [-15, 0, 15],
          Extrapolation.CLAMP
        )}deg`,
      },
    ],
  }));

  // Анімація лицьової сторони картки.
  const frontAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${rotateY.value}deg` },
    ],
    opacity: interpolate(
      rotateY.value,
      [0, 90, 180],
      [1, 0, 0]
    ),
  }));

  // Анімація зворотної сторони картки.
  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${rotateY.value - 180}deg` },
    ],
    opacity: interpolate(
      rotateY.value,
      [0, 90, 180],
      [0, 0, 1]
    ),
  }));

  // Підказка для свайпу ліворуч.
  const leftTipStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-swipeThreshold, 0],
      [1, 0],
      Extrapolation.CLAMP
    ),
  }));

  // Підказка для свайпу праворуч.
  const rightTipStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, swipeThreshold],
      [0, 1],
      Extrapolation.CLAMP
    ),
  }));

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.card, cardAnimatedStyle]}
      >
        <GestureDetector gesture={panGesture}>
          <View style={styles.cardFaces}>
            {/* Лицьова сторона картки */}
            <Animated.View
              style={[
                styles.face,
                styles.frontFace,
                frontAnimatedStyle,
              ]}
              pointerEvents={showFullInfo ? "none" : "auto"}
            >
              <Pressable
                style={styles.frontPressable}
                onPress={flipCard}
                disabled={isAnimatingOut}
              >
                <Text style={styles.word}>
                  {wordInfo.word}
                </Text>

                <Text style={styles.tapHint}>
                  Tap to see the meaning
                </Text>
              </Pressable>
            </Animated.View>

            {/* Зворотна сторона картки */}
            <Animated.View
              style={[
                styles.face,
                styles.backFace,
                backAnimatedStyle,
              ]}
              pointerEvents={showFullInfo ? "auto" : "none"}
            >
              {wordInfo.image ? (
                <Image
                  style={styles.image}
                  source={{ uri: wordInfo.image }}
                />
              ) : null}

              <Text style={styles.word}>
                {wordInfo.word}
              </Text>

              {!!wordInfo.phonetics && (
                <Text style={styles.phonetics}>
                  {wordInfo.phonetics}
                </Text>
              )}

              {!!wordInfo.audio && (
                <Pressable
                  style={styles.playPressable}
                  onPress={() => playSound(wordInfo.audio)}
                >
                  <Ionicons
                    name="volume-medium-outline"
                    size={28}
                    color={colors.primary900}
                  />
                </Pressable>
              )}

              <Text style={styles.meaning}>
                {wordInfo.meaning}
              </Text>

              {/* Кнопки переходу до наступного слова */}
              <View style={styles.buttonsContainer}>
                <Pressable
                  disabled={isAnimatingOut}
                  onPress={handleDidntKnowIt}
                  style={({ pressed }) => [
                    styles.remember,
                    {
                      backgroundColor: colors.secondary800,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <Text style={styles.rememberText}>
                    Didn't know it
                  </Text>
                </Pressable>

                <Pressable
                  disabled={isAnimatingOut}
                  onPress={handleKnewIt}
                  style={({ pressed }) => [
                    styles.remember,
                    {
                      backgroundColor: colors.primary900,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <Text style={styles.rememberText}>
                    Knew it
                  </Text>
                </Pressable>
              </View>
            </Animated.View>
          </View>
        </GestureDetector>
      </Animated.View>

      {/* Підказки під час свайпу */}
      {showFullInfo && (
        <>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.tip,
              styles.leftTip,
              leftTipStyle,
            ]}
          >
            <Text style={styles.tipText}>
              Didn't know it
            </Text>
          </Animated.View>

          <Animated.View
            pointerEvents="none"
            style={[
              styles.tip,
              styles.rightTip,
              rightTipStyle,
            ]}
          >
            <Text style={styles.tipText}>
              Knew it
            </Text>
          </Animated.View>
        </>
      )}
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      position: "relative",
    },

    card: {
      flex: 1,
      margin: 10,
      zIndex: 2,
    },

    cardFaces: {
      flex: 1,
    },

    face: {
      ...StyleSheet.absoluteFillObject,
      borderColor: colors.primary200,
      borderWidth: 1,
      borderRadius: 12,
      backgroundColor: colors.fontInverse,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      backfaceVisibility: "hidden",
      overflow: "hidden",
    },

    frontFace: {
      zIndex: 1,
    },

    backFace: {
      justifyContent: "space-evenly",
    },

    frontPressable: {
      flex: 1,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
    },

    word: {
      fontSize: 28,
      color: colors.fontMain,
      fontWeight: "800",
      textAlign: "center",
      paddingVertical: 12,
    },

    tapHint: {
      color: colors.grey600,
      fontSize: 14,
      marginTop: 12,
    },

    playPressable: {
      padding: 8,
    },

    phonetics: {
      fontSize: 18,
      color: colors.fontMain,
      paddingVertical: 5,
    },

    meaning: {
      fontSize: 18,
      color: colors.fontMain,
      padding: 5,
      textAlign: "center",
    },

    remember: {
      flex: 1,
      minHeight: 48,
      borderRadius: 6,
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: 5,
      paddingHorizontal: 6,
    },

    rememberText: {
      fontSize: 16,
      color: colors.fontInverse,
      textAlign: "center",
    },

    buttonsContainer: {
      flexDirection: "row",
      width: "100%",
      marginTop: 10,
    },

    image: {
      width: 110,
      aspectRatio: 1,
      borderRadius: 8,
    },

    tip: {
      position: "absolute",
      top: 35,
      zIndex: 3,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderWidth: 2,
      borderRadius: 6,
      backgroundColor: colors.fontInverse,
    },

    leftTip: {
      left: 24,
      borderColor: colors.secondary800,
    },

    rightTip: {
      right: 24,
      borderColor: colors.primary900,
    },

    tipText: {
      color: colors.fontMain,
      fontWeight: "800",
      fontSize: 16,
    },
  });
}

export default WordCard;
