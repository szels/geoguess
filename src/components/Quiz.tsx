import React, { useState, useEffect } from 'react';
import { Country, asianCountries } from '../data/countries';
import './Quiz.css';

const Quiz: React.FC = () => {
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const getRandomCountry = () => {
    const randomIndex = Math.floor(Math.random() * asianCountries.length);
    return asianCountries[randomIndex];
  };

  const getRandomCapitals = (correctCapital: string, count: number): string[] => {
    const allCapitals = asianCountries.map(country => country.capital);
    const otherCapitals = allCapitals.filter(capital => capital !== correctCapital);
    const shuffled = otherCapitals.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const generateOptions = (correctCapital: string) => {
    const wrongOptions = getRandomCapitals(correctCapital, 3);
    const allOptions = [...wrongOptions, correctCapital];
    return allOptions.sort(() => 0.5 - Math.random());
  };

  const startNewQuestion = () => {
    const newCountry = getRandomCountry();
    setCurrentCountry(newCountry);
    setOptions(generateOptions(newCountry.capital));
    setSelectedAnswer(null);
    setFeedback('');
  };

  const handleAnswer = (selectedCapital: string) => {
    if (!currentCountry || selectedAnswer !== null) return;
    
    setSelectedAnswer(selectedCapital);
    const isCorrect = selectedCapital === currentCountry.capital;
    setFeedback(isCorrect ? 'Correct! 🎉' : `Wrong! The capital is ${currentCountry.capital}`);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setTotalQuestions(prev => prev + 1);
    
    if (totalQuestions + 1 >= 10) {
      setTimeout(() => setGameOver(true), 1500);
    } else {
      setTimeout(startNewQuestion, 1500);
    }
  };

  const resetGame = () => {
    setScore(0);
    setTotalQuestions(0);
    setGameOver(false);
    startNewQuestion();
  };

  useEffect(() => {
    startNewQuestion();
  }, []);

  if (gameOver) {
    return (
      <div className="quiz-container">
        <h2>Game Over!</h2>
        <p>Your final score: {score} out of {totalQuestions}</p>
        <button onClick={resetGame} className="reset-button">
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h1>Asian Capitals Quiz</h1>
      <div className="score-display">
        Score: {score} / {totalQuestions}
      </div>
      {currentCountry && (
        <div className="question-container">
          <h2>What is the capital of {currentCountry.name}?</h2>
          <div className="options-container">
            {options.map((capital, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(capital)}
                className={`option-button ${
                  selectedAnswer === capital
                    ? capital === currentCountry.capital
                      ? 'correct'
                      : 'incorrect'
                    : ''
                }`}
                disabled={selectedAnswer !== null}
              >
                {capital}
              </button>
            ))}
          </div>
          {feedback && (
            <p className={`feedback ${feedback.includes('Correct') ? 'correct' : 'incorrect'}`}>
              {feedback}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz; 