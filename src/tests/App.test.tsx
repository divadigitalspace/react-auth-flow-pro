import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../auth/AuthContext";
import { Login } from "../pages/Login";

describe("Login Component", () => {
  test("should gogin successfuly", async () => {
    //Arrange
    render(
      <MemoryRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<h1>Dashboard</h1>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );
    //Act
    await userEvent.type(
      screen.getByPlaceholderText("Email"),
      "admin@test.com"
    );
    await userEvent.type(screen.getByPlaceholderText("Password"), "123456");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    //Assert
    expect(await screen.findByText(/dashboard/i)).toBeInTheDocument();
  });
});
