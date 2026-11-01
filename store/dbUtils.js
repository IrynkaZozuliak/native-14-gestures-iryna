import * as SQLite from "expo-sqlite";

const canUseWebSql =
  typeof window !== "undefined" && typeof window.openDatabase === "function";

export const database = canUseWebSql ? SQLite.openDatabase("places.db") : null;

const webStorage = {
  words: [],
  theme: true,
};

function cloneWords() {
  return webStorage.words.map((word) => ({ ...word }));
}

export function init() {
  if (!database) {
    webStorage.words = [];
    webStorage.theme = true;
    return Promise.resolve();
  }

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
  if (!database) {
    webStorage.words = [...webStorage.words, { ...word }];
    return Promise.resolve({ rows: { _array: cloneWords() } });
  }

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
  if (!database) {
    webStorage.words = webStorage.words.map((item) =>
      item.word === word.word ? { ...item, ...word } : item
    );
    return Promise.resolve({ rows: { _array: cloneWords() } });
  }

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
  if (!database) {
    webStorage.words = webStorage.words.filter((item) => item.word !== wordText);
    return Promise.resolve();
  }

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
  if (!database) {
    return Promise.resolve(cloneWords());
  }

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
  if (!database) {
    return Promise.resolve(webStorage.theme);
  }

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
  if (!database) {
    webStorage.theme = !!isDark;
    return Promise.resolve();
  }

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
