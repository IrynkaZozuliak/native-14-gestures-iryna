import { View, StyleSheet, Image } from "react-native";

function ImagePile() {
  return (
    <View style={styles.container}>
      <View style={styles.base}></View>
      <Image style={styles.grass1} source={require(`../assets/grass.png`)} />
      <Image style={styles.palm1} source={require(`../assets/palmtree.png`)} />
      <Image style={styles.palm2} source={require(`../assets/palmtree.png`)} />
      <Image style={styles.palm3} source={require(`../assets/palmtree.png`)} />
      <Image style={styles.elephant} source={require(`../assets/elephant.png`)} />
    </View>
  );
}

export default ImagePile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  base: {
    width: 120,
    aspectRatio: 1,
    backgroundColor: "green",
    borderRadius: 60,
    transform: [{ scaleX: 3 }],
  },
  palm1: {
    position: "absolute",
    width: 100,
    aspectRatio: 1,
    resizeMode: "contain",
    top: -130,
    left: 20,
  },
  palm2: {
    position: "absolute",
    width: 100,
    aspectRatio: 1,
    resizeMode: "contain",
    top: -110,
    right: 10,
  },
  palm3: {
    position: "absolute",
    width: 150,
    aspectRatio: 1,
    resizeMode: "contain",
    top: -110,
    right: 170,
  },
  grass1: {
    position: "absolute",
    width: 100,
    aspectRatio: 1,
    resizeMode: "contain",
    top: -130,
    right: 100,
  },
  elephant: {
    position: "absolute",
    width: 115,
    aspectRatio: 1,
    resizeMode: "contain",
    top: 40,
    right: 100,
  },
});
