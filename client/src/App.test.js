import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';

test('renders onkar landing content', () => {
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  );

  expect(screen.getByText(/Onkar/i)).toBeInTheDocument();
  expect(screen.getByText(/Industrial Order Intelligence/i)).toBeInTheDocument();
});
