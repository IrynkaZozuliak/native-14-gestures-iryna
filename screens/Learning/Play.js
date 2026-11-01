import { View, Text, StyleSheet, Image } from "react-native";
import { useState, useMemo } from "react";
import { useSelector } from "react-redux";

import { selectWordsToLearn } from "../../store/wordsLearningSlice";
import WordCard from "../../components/WordCard";

export default function Play() {
  const wordsToStudy = useSelector(selectWordsToLearn);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const colors = useSelector((state) => state.theme.colors);
  const styles = useMemo(() => getStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      {wordsToStudy.length === 0 ? (
        <>
          <Text style={[styles.text, { alignSelf: "center" }]}>Congrats!</Text>
          <Text style={styles.text}>For now you have learnt all the words</Text>
          <Image style={styles.image} source={require("../../assets/well-done-icon.png")} />
        </>
      ) : (
        <WordCard
          wordInfo={wordsToStudy[currentWordIndex % wordsToStudy.length]}
          setNext={() =>
            setCurrentWordIndex(
              (currentWordIndex) => (currentWordIndex + 1) % wordsToStudy.length
            )
          }
        />
      )}
    </View>
  );
}

function getStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.appBackground,
    },
    text: {
      color: colors.fontMain,
      fontSize: 22,
      margin: 10,
      marginTop: 25,
    },
    image: {
      width: "100%",
      height: undefined,
      aspectRatio: 1,
      alignSelf: "center",
      resizeMode: "contain",
    },
  });
}
