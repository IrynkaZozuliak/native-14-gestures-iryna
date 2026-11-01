import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Pressable,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { playSound } from "../../services/soundHandler";
import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { wordsLearningActions } from "../../store/wordsLearningSlice";
import ImagePicker from "../../components/ImagePicker";

function EditWord({ route, navigation }) {
  const [wordData, setWordData] = useState(() => route.params.wordData);
  const colors = useSelector((state) => state.theme.colors);
  const styles = useMemo(() => getStyles(colors), [colors]);
  const dispatch = useDispatch();

  function onSave() {
    dispatch(wordsLearningActions.updateWord(wordData));
    navigation.navigate(
      "AllWords"
    );
  }

  function onChangeWordData(text, propName) {
    setWordData((prevData) => ({ ...prevData, [propName]: text }));
  }

  return (
    <>
      <ImagePicker
        onTakeImage={(uri) => setWordData((prev) => ({ ...prev, image: uri }))}
        image={wordData.image}
      />
      <View style={styles.receivedInfoContainer}>
        <View style={{ flexDirection: "row", alignItems: "baseline" }}>
          <Text style={styles.word}>{wordData.word}</Text>
          {wordData.audio && (
            <Pressable
              style={styles.playPressable}
              onPress={() => playSound(wordData.audio)}
            >
              <Ionicons
                name="volume-medium-outline"
                size={28}
                color={colors.primary900}
              />
            </Pressable>
          )}
        </View>
        <View style={{ flexDirection: "row", alignItems: "baseline", gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>phonetics:</Text>
            <TextInput
              value={wordData.phonetics}
              style={styles.input}
              onChangeText={(text) => onChangeWordData(text, "phonetics")}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>part of speach:</Text>
            <TextInput
              style={styles.input}
              value={wordData.partOfSpeech}
              onChangeText={(text) => onChangeWordData(text, "partOfSpeech")}
            />
          </View>
        </View>
        <Text style={styles.label}>meaning:</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={4}
          onChangeText={(text) => onChangeWordData(text, "meaning")}
          value={wordData.meaning}
          textAlignVertical={"top"}
        />
        {wordData.word && (
          <Pressable style={styles.buttonContainer} onPress={onSave}>
            <Text style={{ fontSize: 24, color: colors.fontInverse }}>
              Save
            </Text>
          </Pressable>
        )}
      </View>
    </>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    input: {
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 6,
      borderColor: colors.primary200,
      color: colors.fontMain,
    },
    label: {
      fontSize: 12,
      color: colors.grey600,
      marginBottom: 4,
      paddingTop: 10,
    },
    inputContainer: {
      margin: 12,
    },
    receivedInfoContainer: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 10,
      fontSize: 32,
    },
    word: {
      fontSize: 32,
      paddingHorizontal: 10,
      color: colors.fontMain,
    },
    phonetics: {
      fontSize: 20,
      paddingHorizontal: 10,
    },
    partOfSpeech: {
      fontSize: 20,
      paddingHorizontal: 10,
    },
    meaning: {
      fontSize: 16,
      padding: 13,
    },
    buttonContainer: {
      borderRadius: 4,
      backgroundColor: colors.primary900,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 14,
    },
    backPressable: {
      position: "absolute",
      width: 60,
      borderRadius: 30,
      aspectRatio: 1,
      top: "2%",
      left: "2%",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10,
    },
    playPressable: {
      marginHorizontal: 20,
    },
  });
}

export default EditWord;
