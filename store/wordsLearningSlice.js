import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";
import { INITIAL_FORGETTING_SPAN } from "../constants";
import * as dbUtils from "../store/dbUtils";

const initialState = {
  words: [],
};

const wordsLearningSlice = createSlice({
  name: "words",
  initialState: initialState,
  reducers: {
    setInitial(state, action) {
      state.words = action.payload;
    },
    updateWordLearnInfo(state, action) {
      const wordInfoToUpdate = state.words.find(
        (wordInfo) => wordInfo.word === action.payload
      );
      const milisecondsNow = new Date().getTime();
      wordInfoToUpdate.dateForgets = new Date(
        milisecondsNow + wordInfoToUpdate.forgettingSpan
      ).getTime();
      wordInfoToUpdate.forgettingSpan *= 2;
      wordInfoToUpdate.dateTotallyForgets = new Date(
        milisecondsNow + wordInfoToUpdate.forgettingSpan
      ).getTime();
      wordInfoToUpdate.status = 2;
      dbUtils.updateWord({ ...wordInfoToUpdate });
    },
    addWord(state, action) {
      if (state.words.find((el) => el.word === action.payload.word)) return;
      const nowMiliseconds = new Date().getTime();
      const wordData = { ...action.payload };
      wordData.dateForgets = new Date(
        nowMiliseconds - INITIAL_FORGETTING_SPAN
      ).getTime();
      wordData.dateTotallyForgets = nowMiliseconds;
      wordData.forgettingSpan = INITIAL_FORGETTING_SPAN;
      wordData.status = 0;
      state.words.push(wordData);
      console.log("dbUtils will be called")
      dbUtils.addWord(wordData);
    },
    updateWord(state, action) {
      const wordIndexToUpdate = state.words.findIndex(
        (wordInfo) => wordInfo.word === action.payload.word
      );
      state.words[wordIndexToUpdate] = {
        ...state.words[wordIndexToUpdate],
        ...action.payload,
      };
      dbUtils.updateWord(state.words[wordIndexToUpdate]);
    },
    removeWord(state, action) {
      state.words = state.words.filter((item) => item.word != action.payload);
      dbUtils.deleteWord(action.payload);
    },
    updateStatuses(state) {
      const milisecondsNow = new Date().getTime();
      for (const wordInfo of state.words) {
        if (wordInfo.dateTotallyForgets <= milisecondsNow) {
          wordInfo.status = 0;
        } else if (
          wordInfo.dateForgets <= milisecondsNow &&
          wordInfo.dateTotallyForgets > milisecondsNow
        ) {
          wordInfo.status = 1;
        }
        dbUtils.updateWord({ ...wordInfo });
      }
    },
  },
});

export const selectWordsToLearn = createSelector(
  (state) => state.wordsLearning.words,
  (words) => words.filter((word) => word.status < 2)
);

export const wordsLearningActions = wordsLearningSlice.actions;

export default wordsLearningSlice;
