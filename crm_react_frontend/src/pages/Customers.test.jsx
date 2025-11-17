import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../App";

beforeEach(() => {
  window.location.hash = "#/customers";
  window.innerWidth = 1200;
  jest.restoreAllMocks();
});

test("renders Customers list from backend and navigates to detail", async () => {
  const fetchMock = jest.spyOn(global, "fetch").mockImplementation((url) => {
    const u = url.toString();
    if (u.includes("/customers?")) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({
          items: [
            { id: 42, name: "Acme Corp", email: "ops@acme.com", phone: "+1 202 555 0147", data: {} },
          ],
          total: 1,
          page: 1,
          page_size: 10,
        }),
      });
    }
    if (u.match(/\/customers\/42(\?|$)/)) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({
          id: 42,
          name: "Acme Corp",
          email: "ops@acme.com",
          phone: "+1 202 555 0147",
          data: {},
          interactions: [],
          open_requests: [],
        }),
      });
    }
    // default ok for other calls (e.g., /auth/me or metrics)
    return Promise.resolve({ ok: true, status: 200, json: async () => ({}) });
  });

  render(<App />);

  // Heading present
  await waitFor(() => {
    expect(screen.getByRole("heading", { name: /Customers/i })).toBeInTheDocument();
  });

  // Row rendered
  await waitFor(() => {
    expect(screen.getByText(/Acme Corp/i)).toBeInTheDocument();
  });

  // Click row to navigate
  const row = screen.getByText(/Acme Corp/i).closest("tr");
  fireEvent.click(row);

  await waitFor(() => {
    expect(window.location.hash).toMatch(/#\/customers\/42/);
  });

  // Detail heading shows company name
  await waitFor(() => {
    expect(screen.getByRole("heading", { name: /Acme Corp/i })).toBeInTheDocument();
  });

  fetchMock.mockRestore();
});
