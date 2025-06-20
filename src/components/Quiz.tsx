import React, { useState, useEffect, useCallback } from 'react';
import { countries } from '../data/countries';
import './Quiz.css';

const Quiz: React.FC = () => {
  const [currentCountry, setCurrentCountry] = useState<{ name: string; capital: string } | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getRandomCountry = () => {
    if (!countries || countries.length === 0) {
      setError('Keine Länderdaten verfügbar');
      return null;
    }
    const randomIndex = Math.floor(Math.random() * countries.length);
    return countries[randomIndex];
  };

  const getRandomCapitals = (excludeCapital: string, count: number): string[] => {
    if (!countries || countries.length === 0) return [];
    const filteredCountries = countries.filter(c => c.capital !== excludeCapital);
    const shuffled = [...filteredCountries].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(c => c.capital);
  };

  const generateOptions = (correctCapital: string): string[] => {
    const incorrectCapitals = getRandomCapitals(correctCapital, 3);
    const allOptions = [...incorrectCapitals, correctCapital];
    return allOptions.sort(() => 0.5 - Math.random());
  };

  const startNewQuestion = useCallback(() => {
    const country = getRandomCountry();
    if (!country) return;
    setCurrentCountry(country);
    setOptions(generateOptions(country.capital));
    setFeedback(null);
    setSelectedAnswer(null);
  }, []);

  useEffect(() => {
    startNewQuestion();
  }, [startNewQuestion]);

  const handleAnswer = (selectedCapital: string) => {
    if (selectedAnswer !== null || !currentCountry) return; // Prevent multiple selections
    setSelectedAnswer(selectedCapital);
    const isCorrect = selectedCapital === currentCountry.capital;
    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback('Richtig!');
    } else {
      setFeedback(`Falsch. Die richtige Antwort ist ${currentCountry.capital}.`);
    }
    setTotalQuestions(prev => prev + 1);
    setTimeout(() => {
      if (totalQuestions + 1 >= 20) {
        setGameOver(true);
      } else {
        startNewQuestion();
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setScore(0);
    setTotalQuestions(0);
    setGameOver(false);
    setFeedback(null);
    setSelectedAnswer(null);
    setError(null);
    startNewQuestion();
  };

  if (error) {
    return (
      <div className="quiz-container">
        <h2>Fehler</h2>
        <p>{error}</p>
        <button onClick={resetQuiz}>Erneut versuchen</button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="quiz-container">
        <h2>Quiz beendet!</h2>
        <p>Dein Ergebnis: {score} von {totalQuestions}</p>
        <button onClick={resetQuiz}>Neu starten</button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h2>Asiatische Hauptstädte Quiz</h2>
      <p>Punktzahl: {score} / {totalQuestions}</p>
      {currentCountry && (
        <div className="question-container">
          <h3>Was ist die Hauptstadt von {currentCountry.name}?</h3>
          <div className="options-container">
            {options.map((capital, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(capital)}
                disabled={selectedAnswer !== null}
                className={`option-button ${selectedAnswer === capital ? (capital === currentCountry.capital ? 'correct' : 'incorrect') : ''}`}
              >
                {capital}
              </button>
            ))}
          </div>
          {feedback && <p className="feedback">{feedback}</p>}
        </div>
      )}
    </div>
  );
};

export default Quiz; 