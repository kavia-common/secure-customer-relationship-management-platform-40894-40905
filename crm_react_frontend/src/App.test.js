import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  // Ensure the app starts on dashboard route and wide viewport (not collapsed)
  window.location.hash = '#/';
  // Make sure sidebar isn't auto-collapsed by responsive logic
  window.innerWidth = 1200;
  jest.restoreAllMocks();
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
  // Mock backend for /requests
  global.fetch = jest.fn((url) => {
    const u = url.toString();
    if (u.includes('/requests?')) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ([
          { id: 101, customer_id: 5001, subject: 'Reset password', description: 'desc', priority: 'normal', status: 'open', assignee_id: null, meta: { created_at: '2025-02-03' } }
        ])
      });
    }
    // default empty for other endpoints used by AppProvider or Dashboard
    return Promise.resolve({ ok: true, status: 200, json: async () => ({}) });
  });

  render(<App />);
  const link = screen.getByRole('link', { name: /Requests/i });
  fireEvent.click(link);
  await waitFor(() => {
    expect(screen.getByRole('heading', { name: /Service Requests/i })).toBeInTheDocument();
  });
  // Ensure row rendered from backend
  await waitFor(() => {
    expect(screen.getByText(/Reset password/i)).toBeInTheDocument();
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

test('request detail loads from backend for numeric id', async () => {
  global.fetch = jest.fn((url) => {
    const u = url.toString();
    if (u.includes('/requests/123/history')) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ([
          { id: 1, request_id: 123, from_status: 'open', to_status: 'in_progress', note: 'Started' }
        ])
      });
    }
    if (u.match(/\/requests\/123(\?|$)/)) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({
          id: 123,
          customer_id: 5001,
          subject: 'Install software',
          description: 'Please install',
          priority: 'high',
          status: 'open',
          assignee_id: 42
        })
      });
    }
    return Promise.resolve({ ok: true, status: 200, json: async () => ({}) });
  });

  window.location.hash = '#/requests/123';
  render(<App />);
  await waitFor(() => {
    expect(screen.getByRole('heading', { name: /Request #123/i })).toBeInTheDocument();
  });
  expect(screen.getByText(/Install software/i)).toBeInTheDocument();
  expect(screen.getByText(/Agent #42/i)).toBeInTheDocument();
  // history row present
  await waitFor(() => {
    expect(screen.getByText(/Started/i)).toBeInTheDocument();
  });
});
