
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

  const currentWord = wordsToStudy.length
    ? wordsToStudy[currentWordIndex % wordsToStudy.length]
    : null;

  const nextWord =
    wordsToStudy.length > 1
      ? wordsToStudy[
          (currentWordIndex + 1) % wordsToStudy.length
        ]
      : null;

  // Перехід до наступного слова.
  const goToNextWord = () => {
    setCurrentWordIndex((index) => index + 1);
  };

  return (
    <View style={styles.container}>
      {!currentWord ? (
        <>
          <Text style={[styles.text, { alignSelf: "center" }]}>
            Congrats!
          </Text>

          <Text style={styles.text}>
            For now you have learnt all the words
          </Text>

          <Image
            style={styles.image}
            source={require("../../assets/well-done-icon.png")}
          />
        </>
      ) : (
        <View style={styles.deck}>
          {/* Нижня картка колоди */}
          <View
            style={[
              styles.deckCard,
              styles.deckCardBack,
            ]}
          />

          {/* Картка наступного слова */}
          <View
            style={[
              styles.deckCard,
              styles.deckCardFront,
            ]}
          >
            {nextWord ? (
              <Text style={styles.nextWord}>
                {nextWord.word}
              </Text>
            ) : null}
          </View>

          {/* Поточна картка */}
          <WordCard
            key={`${currentWord.word}-${currentWordIndex}`}
            wordInfo={currentWord}
            setNext={goToNextWord}
          />
        </View>
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

    deck: {
      flex: 1,
      position: "relative",
      paddingBottom: 8,
    },

    deckCard: {
      position: "absolute",
      top: 24,
      bottom: 4,
      left: 4,
      right: 4,
      borderWidth: 1,
      borderColor: colors.primary200,
      borderRadius: 12,
      backgroundColor: colors.fontInverse,
      alignItems: "center",
      justifyContent: "flex-start",
      paddingTop: 28,
    },

    deckCardBack: {
      transform: [{ rotate: "-3deg" }],
      opacity: 0.65,
    },

    deckCardFront: {
      top: 16,
      bottom: 8,
      left: 7,
      right: 7,
      transform: [{ rotate: "2deg" }],
      opacity: 0.9,
    },

    nextWord: {
      color: colors.grey600,
      fontSize: 18,
      fontWeight: "600",
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
