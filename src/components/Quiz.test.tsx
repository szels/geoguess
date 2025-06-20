import React from 'react';
import { render, screen } from '@testing-library/react';
import Quiz from './Quiz';

describe('Quiz Component', () => {
  test('renders Quiz component', () => {
    render(<Quiz />);
    expect(screen.getByText(/Asiatische Hauptstädte Quiz/i)).toBeInTheDocument();
  });

  test('displays a question', () => {
    render(<Quiz />);
    expect(screen.getByText(/Was ist die Hauptstadt von/i)).toBeInTheDocument();
  });

  test('renders options as buttons', () => {
    render(<Quiz />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
}); 