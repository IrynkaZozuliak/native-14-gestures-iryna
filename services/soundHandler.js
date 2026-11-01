import { Audio } from "expo-av";

export async function playSound(audioPath) {
  const sound = new Audio.Sound();
  try {
    await sound.loadAsync(
      {
        uri: audioPath,
      },
      { shouldPlay: true }
    );
    await sound.playAsync();
    setTimeout(() => sound.unloadAsync(), 2000);
  } catch (error) {
    console.log(error);
  }
}
