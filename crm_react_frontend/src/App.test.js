import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  // Ensure the app starts on dashboard route and wide viewport (not collapsed)
  window.location.hash = '#/';
  // Make sure sidebar isn't auto-collapsed by responsive logic
  window.innerWidth = 1200;
});

test('renders Dashboard heading', () => {
  render(<App />);
  const heading = screen.getByText(/Dashboard/i);
  expect(heading).toBeInTheDocument();
});

test('navigates to Customers from Sidebar', async () => {
  render(<App />);
  const link = screen.getByRole('link', { name: /Customers/i });
  fireEvent.click(link);
  await waitFor(() => {
    expect(screen.getByRole('heading', { name: /Customers/i })).toBeInTheDocument();
  });
});

test('navigates to Requests from Sidebar', async () => {
  render(<App />);
  const link = screen.getByRole('link', { name: /Requests/i });
  fireEvent.click(link);
  await waitFor(() => {
    expect(screen.getByRole('heading', { name: /Service Requests/i })).toBeInTheDocument();
  });
});

test('quick action Create Request goes to New Request page', async () => {
  render(<App />);
  const quick = screen.getByRole('link', { name: /Create Request/i });
  fireEvent.click(quick);
  await waitFor(() => {
    expect(screen.getByRole('heading', { name: /New Service Request/i })).toBeInTheDocument();
  });
});

test('Topbar login button navigates to Login page', async () => {
  render(<App />);
  const btn = screen.getByRole('button', { name: /Login/i });
  fireEvent.click(btn);
  await waitFor(() => {
    expect(screen.getByRole('heading', { name: /Sign in/i })).toBeInTheDocument();
  });
});

test('navigates to Admin Audit from Sidebar', async () => {
  render(<App />);
  const link = screen.getByRole('link', { name: /Audit/i });
  fireEvent.click(link);
  await waitFor(() => {
    expect(screen.getByRole('heading', { name: /Audit/i })).toBeInTheDocument();
  });
});
