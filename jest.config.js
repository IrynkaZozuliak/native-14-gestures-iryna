module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["@testing-library/react-native/extend-expect"],
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",
  },
};
