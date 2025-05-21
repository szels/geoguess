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

  const getRandomCountry = () => {
    const randomIndex = Math.floor(Math.random() * countries.length);
    return countries[randomIndex];
  };

  const getRandomCapitals = (excludeCapital: string, count: number): string[] => {
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
    setCurrentCountry(country);
    setOptions(generateOptions(country.capital));
    setFeedback(null);
    setSelectedAnswer(null);
  }, []);

  useEffect(() => {
    startNewQuestion();
  }, [startNewQuestion]);

  const handleAnswer = (selectedCapital: string) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections
    setSelectedAnswer(selectedCapital);
    const isCorrect = selectedCapital === currentCountry?.capital;
    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback('Correct!');
    } else {
      setFeedback(`Incorrect. The correct answer is ${currentCountry?.capital}.`);
    }
    setTotalQuestions(prev => prev + 1);
    setTimeout(() => {
      if (totalQuestions + 1 >= 10) {
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
    startNewQuestion();
  };

  if (gameOver) {
    return (
      <div className="quiz-container">
        <h2>Quiz Complete!</h2>
        <p>Your score: {score} out of {totalQuestions}</p>
        <button onClick={resetQuiz}>Restart Quiz</button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h2>Asian Capitals Quiz</h2>
      <p>Score: {score} / {totalQuestions}</p>
      {currentCountry && (
        <div className="question-container">
          <h3>What is the capital of {currentCountry.name}?</h3>
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