import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Patch Automation react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/Patch Automation/i);
  expect(linkElement).toBeInTheDocument();
});
