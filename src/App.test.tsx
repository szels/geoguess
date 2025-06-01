import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders quiz title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Asiatische Hauptstädte Quiz/i);
  expect(titleElement).toBeInTheDocument();
});
