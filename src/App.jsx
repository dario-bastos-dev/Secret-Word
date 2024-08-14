// CSS
import "./App.css";
// Hooks
import { useCallback, useEffect, useState } from "react";
// Data
import { wordList } from "./data/Word";
// Components
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import GameOver from "./components/GameOver";

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

const guesesQty = 5;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guesedLetters, setGuesedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [gueses, setGueses] = useState(guesesQty);
  const [score, setScore] = useState(0);

  // Start the game
  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];

    const word =
      words[category][Math.floor(Math.random() * words[category].length)];

    return { word, category };
  }, [words]);

  const startGame = useCallback(() => {
    clearLetterStates();

    const { word, category } = pickWordAndCategory();

    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);
  // Process the letter input
  const verifyLetter = (letter) => {
    const normalizeLetter = letter.toLowerCase();

    if (
      guesedLetters.includes(normalizeLetter) ||
      wrongLetters.includes(normalizeLetter)
    ) {
      return;
    }

    if (letters.includes(normalizeLetter)) {
      setGuesedLetters((actualGuessedLeters) => [
        ...actualGuessedLeters,
        normalizeLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizeLetter,
      ]);

      setGueses((actualGuesses) => actualGuesses - 1);
    }
  };
  const clearLetterStates = () => {
    setGuesedLetters([]);
    setWrongLetters([]);
  };
  useEffect(() => {
    if (gueses <= 0) {
      clearLetterStates();

      setGameStage(stages[2].name);
    }
  }, [gueses]);

  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    if (guesedLetters.length == 0) {
      return;
    } else {
      if (guesedLetters.length === uniqueLetters.length) {
        setScore((actualScore) => actualScore + 100);

        startGame();
      }
    }
  }, [guesedLetters, letters, startGame]);
  // Restarts the game
  const retry = () => {
    setScore(0);
    setGueses(guesesQty);

    setGameStage(stages[0].name);
  };

  return (
    <>
      <div className="App">
        {gameStage == "start" && <StartScreen startGame={startGame} />}
        {gameStage == "game" && (
          <Game
            verifyLetter={verifyLetter}
            pickedWord={pickedWord}
            pickedCategory={pickedCategory}
            letters={letters}
            guesedLetters={guesedLetters}
            wrongLetters={wrongLetters}
            gueses={gueses}
            score={score}
          />
        )}
        {gameStage == "end" && <GameOver retry={retry} score={score} />}
      </div>
    </>
  );
}

export default App;
