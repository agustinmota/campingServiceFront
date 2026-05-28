import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import { PublicHomePage } from "./features/public/PublicHomePage";
import { LoginPage } from "./features/auth/LoginPage";
import { RegisterPage } from "./features/auth/RegisterPage";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { CabinsPage } from "./features/cabins/CabinsPage";
import { CampsitesPage } from "./features/campsites/CampsitesPage";
import { GuestsPage } from "./features/guests/GuestsPage";
import { BookingsPage } from "./features/bookings/BookingsPage";
import { ReservationPage } from "./features/reservations/ReservationPage";
import { ProtectedRoute } from "./shared/ProtectedRoute";
import { RoleRoute } from "./shared/RoleRoute";
import { AppIndexRedirect } from "./shared/AppIndexRedirect";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicHomePage />
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AppIndexRedirect /> },
      {
        path: "dashboard",
        element: (
          <RoleRoute roles={["admin"]}>
            <DashboardPage />
          </RoleRoute>
        )
      },
      { path: "cabins", element: <CabinsPage /> },
      { path: "reserve/:type/:id", element: <ReservationPage /> },
      { path: "campsites", element: <CampsitesPage /> },
      {
        path: "guests",
        element: (
          <RoleRoute roles={["admin"]}>
            <GuestsPage />
          </RoleRoute>
        )
      },
      {
        path: "bookings",
        element: (
          <RoleRoute roles={["admin"]}>
            <BookingsPage />
          </RoleRoute>
        )
      }
    ]
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
]);
