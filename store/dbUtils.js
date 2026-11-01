import * as SQLite from "expo-sqlite";

export const database = SQLite.openDatabase("places.db");

export function init() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS words (
          word TEXT PRIMARY KEY NOT NULL,
          meaning TEXT NOT NULL,
          phonetics TEXT,
          audio TEXT,
          image TEXT,
          status INTEGER NOT NULL,
          dateForgets INTEGER NOT NULL,
          dateTotallyForgets INTEGER NOT NULL,
          forgettingSpan INTEGER NOT NULL
        )`,
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS theme (
            isDark BOOL NOT NULL          
          )`,
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export function addWord(word) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO words (word,
          meaning,
          phonetics,
          audio,
          image,
          status,
          dateForgets,
          dateTotallyForgets,
          forgettingSpan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          word.word,
          word.meaning,
          word.phonetics,
          word.audio,
          word.image,
          word.status,
          word.dateForgets,
          word.dateTotallyForgets,
          word.forgettingSpan,
        ],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}
export function updateWord(word) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `UPDATE words
        SET 
          meaning = ?,
          phonetics = ?,
          audio = ?,
          image = ?,
          status = ?,
          dateForgets = ?,
          dateTotallyForgets = ?,
          forgettingSpan = ?
          WHERE word = ?`,
        [
          word.meaning,
          word.phonetics,
          word.audio,
          word.image,
          word.status,
          word.dateForgets,
          word.dateTotallyForgets,
          word.forgettingSpan,
          word.word,
        ],
        (_, result) => {
          resolve(result);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export function deleteWord(wordText) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM words WHERE word = ?",
        [wordText],
        (_, result) => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export function getWords() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM words",
        [],
        (_, result) => {
          resolve(result.rows._array);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}
export function getTheme() {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM theme",
        [],
        (_, result) => {
          resolve(
            result.rows.length === 0 ? true : !!result.rows._array[0].isDark
          );
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export function setTheme(isDark) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql("DELETE FROM theme", [], null, (_, error) => {
        reject(error);
      });
      tx.executeSql(
        "INSERT INTO theme (isDark) VALUES (?)",
        [isDark],
        () => resolve(),
        (_, error) => {
          reject(error);
        }
      );
    });
  });

  return promise;
}
