import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import App from "../App";

beforeEach(() => {
  window.location.hash = "#/customers/77";
  window.innerWidth = 1200;
  jest.restoreAllMocks();
});

test("loads customer detail (numeric id) and shows interactions and requests", async () => {
  const fetchMock = jest.spyOn(global, "fetch").mockImplementation((url) => {
    const u = url.toString();
    if (u.match(/\/customers\/77(\?|$)/)) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({
          id: 77,
          name: "Globex Inc",
          email: "contact@globex.com",
          phone: "+1 415 555 0199",
          data: {},
          interactions: [{ id: 1, type: "call", channel: "CTI", content: "Intro call" }],
          open_requests: [{ id: 1001, subject: "Onboarding help", status: "open", priority: "normal" }],
        }),
      });
    }
    // default ok for other calls
    return Promise.resolve({ ok: true, status: 200, json: async () => ({}) });
  });

  render(<App />);

  await waitFor(() => {
    expect(screen.getByRole("heading", { name: /Globex Inc/i })).toBeInTheDocument();
  });

  // Interactions tab
  const interactionsTab = screen.getByRole("tab", { name: /Interactions/i });
  fireEvent.click(interactionsTab);
  await waitFor(() => {
    expect(screen.getByText(/Intro call/i)).toBeInTheDocument();
  });

  // Requests tab
  const requestsTab = screen.getByRole("tab", { name: /Requests/i });
  fireEvent.click(requestsTab);
  await waitFor(() => {
    expect(screen.getByText(/Onboarding help/i)).toBeInTheDocument();
  });

  fetchMock.mockRestore();
});
