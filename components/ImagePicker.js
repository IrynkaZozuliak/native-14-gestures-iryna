import { Alert, Image, StyleSheet, Text, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { useMemo } from "react";

import {
  launchImageLibraryAsync,
  useMediaLibraryPermissions,
  PermissionStatus,
} from "expo-image-picker";
import { useState } from "react";

function ImagePicker({ onTakeImage, image, disabled }) {
  const [pickedImage, setPickedImage] = useState(image);
  const colors = useSelector((state) => state.theme.colors);
  const styles = useMemo(() => getStyles(colors), [colors]);

  const [cameraPermissionInformation, requestPermission] =
    useMediaLibraryPermissions();

  async function verifyPermissions() {
    if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
      const permissionResponse = await requestPermission();

      return permissionResponse.granted;
    }

    if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
      Alert.alert(
        "Insufficient Permissions!",
        "Please, grant gallery permissions to use this app."
      );
      return false;
    }

    return true;
  }

  async function takeImageHandler() {
    const hasPermission = await verifyPermissions();

    if (!hasPermission) {
      return;
    }

    const result = await launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      onTakeImage(result.assets[0].uri);
      setPickedImage(result.assets[0].uri);
    }
  }

  let imagePreview = (
    <Pressable
      style={styles.containerPreview}
      disabled={disabled}
      onPress={takeImageHandler}
    >
      <Ionicons name="image-outline" size={46} color={colors.fontMain} />
      <Text style={styles.textPreview}>No image taken yet.</Text>
    </Pressable>
  );

  if (pickedImage) {
    imagePreview = (
      <Pressable onPress={takeImageHandler} style={styles.imagePreview}>
        <Image style={styles.image} source={{ uri: pickedImage }} />
      </Pressable>
    );
  }

  return <>{imagePreview}</>;
}

export default ImagePicker;

function getStyles(colors) {
  return StyleSheet.create({
    containerPreview: {
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 0.5,
      borderColor: colors.fontMain,
      borderRadius: 5,
      margin: 15,
      backgroundColor: colors.grey300,
      width: 150,
      aspectRatio: 1,
      opacity: 0.6,
    },
    textPreview: {
      color: colors.fontMain,
    },
    imagePreview: {
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 5,
      overflow: "hidden",
    },
    image: {
      width: 150,
      aspectRatio: 1,
    },
  });
}
