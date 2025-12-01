import { render, screen } from "@testing-library/react";
import App from "../App";

describe("App", () => {
  it("renders Day 1 heading", () => {
    render(<App />);
    expect(
      screen.getByText(/Day 1 – Auth Flow Base Setup/i)
    ).toBeInTheDocument();
  });
});
