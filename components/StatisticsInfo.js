import { View, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

import InfoCard from "./InfoCard";

function StatisticsInfo() {
  const isDark = useSelector((state) => state.theme.isDark);
  const words = useSelector((state) => state.wordsLearning.words);

  return (
    <View style={styles.container}>
      <InfoCard
        caption={"To learn"}
        number={
          words.filter((word) => word.status === 0)
            .length
        }
        color={isDark ? "hotpink" : "mediumvioletred"}
      />
      <InfoCard
        caption={"In process"}
        number={words.filter((word) => word.status === 1).length}
        color={isDark ? "lightgreen" : "green"}
      />
      <InfoCard
        caption={"Learned"}
        number={
          words.filter((word) => word.status === 2).length
        }
        color={isDark ? "lightblue" : "mediumblue"}
      />
    </View>
  );
}

export default StatisticsInfo;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: "20%",
  },
});
