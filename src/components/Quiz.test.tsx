import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Quiz from './Quiz';

describe('Quiz Component', () => {
  test('renders Quiz component with German title', () => {
    render(<Quiz />);
    expect(screen.getByText('Asiatische Hauptstädte Quiz')).toBeInTheDocument();
  });

  test('displays a question in German', () => {
    render(<Quiz />);
    expect(screen.getByText(/Was ist die Hauptstadt von/i)).toBeInTheDocument();
  });

  test('renders four option buttons', () => {
    render(<Quiz />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(4); // One correct and three incorrect options
  });

  test('shows correct feedback when selecting correct answer', async () => {
    render(<Quiz />);
    const buttons = screen.getAllByRole('button');
    
    // Find the correct answer by checking the feedback
    let correctButton;
    for (const button of buttons) {
      fireEvent.click(button);
      if (screen.getByText('Richtig!')) {
        correctButton = button;
        break;
      }
    }
    
    expect(correctButton).toBeTruthy();
    expect(screen.getByText('Richtig!')).toBeInTheDocument();
  });

  test('shows incorrect feedback when selecting wrong answer', async () => {
    render(<Quiz />);
    const buttons = screen.getAllByRole('button');
    
    // Find an incorrect answer
    let incorrectButton;
    for (const button of buttons) {
      fireEvent.click(button);
      if (screen.getByText(/Falsch! Die richtige Antwort ist/)) {
        incorrectButton = button;
        break;
      }
    }
    
    expect(incorrectButton).toBeTruthy();
    expect(screen.getByText(/Falsch! Die richtige Antwort ist/)).toBeInTheDocument();
  });

  test('disables buttons after selection', async () => {
    render(<Quiz />);
    const buttons = screen.getAllByRole('button');
    
    fireEvent.click(buttons[0]);
    
    buttons.forEach(button => {
      expect(button).toBeDisabled();
    });
  });

  test('shows game over screen after 10 questions', async () => {
    render(<Quiz />);
    
    // Answer 10 questions
    for (let i = 0; i < 10; i++) {
      const buttons = screen.getAllByRole('button');
      fireEvent.click(buttons[0]);
      await waitFor(() => {
        expect(screen.queryByText(/Was ist die Hauptstadt von/)).toBeInTheDocument();
      }, { timeout: 3000 });
    }
    
    expect(screen.getByText('Quiz beendet!')).toBeInTheDocument();
    expect(screen.getByText(/Dein Ergebnis:/)).toBeInTheDocument();
  });

  test('resets game when clicking restart button', async () => {
    render(<Quiz />);
    
    // Complete the game
    for (let i = 0; i < 10; i++) {
      const buttons = screen.getAllByRole('button');
      fireEvent.click(buttons[0]);
      await waitFor(() => {
        expect(screen.queryByText(/Was ist die Hauptstadt von/)).toBeInTheDocument();
      }, { timeout: 3000 });
    }
    
    // Click restart
    const restartButton = screen.getByText('Neu starten');
    fireEvent.click(restartButton);
    
    // Check if game is reset
    expect(screen.getByText('Asiatische Hauptstädte Quiz')).toBeInTheDocument();
    expect(screen.getByText('Punktzahl: 0/0')).toBeInTheDocument();
  });
}); 