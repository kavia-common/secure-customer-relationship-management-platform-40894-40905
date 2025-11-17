import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Dashboard heading', () => {
  // Set default hash route
  window.location.hash = '#/';
  render(<App />);
  const heading = screen.getByText(/Dashboard/i);
  expect(heading).toBeInTheDocument();
});
