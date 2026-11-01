import {
  View,
  StyleSheet,
  Text,
  StatusBar,
  Pressable,
  Image,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import { wordsLearningActions } from "../store/wordsLearningSlice";
import { playSound } from "../services/soundHandler";

function Item({ item }) {
  const navigation = useNavigation();
  const colors = useSelector((state) => state.theme.colors);
  const dispatch = useDispatch();
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <View style={styles.item}>
      <Pressable disabled={!item.audio} onPress={() => playSound(item.audio)}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="play-outline"
            size={28}
            style={
              !item.audio
                ? { color: colors.grey300 }
                : { color: colors.primary900 }
            }
          />
        </View>
      </Pressable>

      <Image
        style={[styles.image, { opacity: item.image ? 1 : 0.7 }]}
        source={
          item.image
            ? {
                uri: item.image,
              }
            : require("../assets/no-image.png")
        }
        onError={() => {
          item.image = undefined;
          dispatch(wordsLearningActions.updateWord(item));
        }}
      />

      <Pressable
        style={styles.textContainer}
        onPress={() => navigation.navigate("EditWord", { wordData: item })}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.title}>{item.word}</Text>
          <Ionicons
            name={`battery-${
              item.status === 0 ? "dead" : item.status === 1 ? "half" : "full"
            }-sharp`}
            size={18}
            color={colors.primary900}
          />
        </View>
        <Text style={styles.definition}>{item.meaning}</Text>
      </Pressable>
      <Pressable
        style={styles.iconContainer}
        onPress={() => dispatch(wordsLearningActions.removeWord(item.word))}
      >
        <Ionicons name="trash-outline" size={22} color={colors.secondary800} />
      </Pressable>
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    item: {
      zIndex: -10,
      backgroundColor: colors.fontInverse,
      flexDirection: "row",
      marginVertical: 6,
      marginHorizontal: 5,
      alignItems: "center",
      paddingHorizontal: 5,
      borderRadius: 8,
      elevation: 4,
    },
    title: {
      fontSize: 20,
      fontWeight: "800",
      color: colors.fontMain,
      paddingRight: 20,
    },
    definition: {
      fontSize: 16,
      color: colors.fontMain,
    },
    iconContainer: {
      padding: 3,
      borderRadius: 20,
    },
    textContainer: {
      flex: 1,
      paddingLeft: 10,
      paddingBottom: 5,
    },
    image: {
      width: 60,
      aspectRatio: 1,
    },
  });
}

export default Item;
