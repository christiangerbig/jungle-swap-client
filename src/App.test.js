import { render, screen } from "@testing-library/react";
import App from "./App";

test(
  "renders jungle swap",
  () => {
    render(<App />);
    const linkElement = screen.getByText(/jungle swap/i);
    expect(linkElement).toBeInTheDocument();
  }
);