import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "./themeSlice";
import wordsLearningSlice from "./wordsLearningSlice";
// import * as dbUtils from "../store/dbUtils";

const store = configureStore({
  reducer: {
    theme: themeSlice.reducer,
    wordsLearning: wordsLearningSlice.reducer,
  },
});

// dbUtils
//   .init()
//   .then(dbUtils.getWords)
//   .then((result) => {
//     store.dispatch(wordsLearningSlice.actions.setInitial(result));
//   })
//   .then(dbUtils.getTheme)
//   .then((result) => store.dispatch(themeSlice.actions.setInitial(result)));
// .then(() => setIsIninialized(true));

export default store;
