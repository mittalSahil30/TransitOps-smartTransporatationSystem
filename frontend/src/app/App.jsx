import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/features/auth/AuthContext";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";
import { RoleGate } from "@/features/auth/RoleGate";
import { AppLayout } from "@/components/layout/AppLayout";

import LoginPage from "@/features/auth/LoginPage";
import RegisterPage from "@/features/auth/RegisterPage";
import ProfilePage from "@/features/auth/ProfilePage";
import DashboardPage from "@/features/dashboard/DashboardPage";

import VehiclesListPage from "@/features/vehicles/VehiclesListPage";
import VehicleFormPage from "@/features/vehicles/VehicleFormPage";
import VehicleDetailsPage from "@/features/vehicles/VehicleDetailsPage";

import DriversListPage from "@/features/drivers/DriversListPage";
import DriverFormPage from "@/features/drivers/DriverFormPage";
import DriverDetailsPage from "@/features/drivers/DriverDetailsPage";

import TripsListPage from "@/features/trips/TripsListPage";
import TripFormPage from "@/features/trips/TripFormPage";
import TripDetailsPage from "@/features/trips/TripDetailsPage";

import MaintenanceListPage from "@/features/maintenance/MaintenanceListPage";
import MaintenanceFormPage from "@/features/maintenance/MaintenanceFormPage";
import MaintenanceDetailsPage from "@/features/maintenance/MaintenanceDetailsPage";

import FuelListPage from "@/features/fuel/FuelListPage";
import FuelFormPage from "@/features/fuel/FuelFormPage";
import FuelDetailsPage from "@/features/fuel/FuelDetailsPage";

import ExpensesListPage from "@/features/expenses/ExpensesListPage";
import ExpenseFormPage from "@/features/expenses/ExpenseFormPage";
import ExpenseDetailsPage from "@/features/expenses/ExpenseDetailsPage";

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold text-slate-900">404</h1>
        <p className="mt-2 text-slate-600">This page doesn't exist.</p>
        <a href="/" className="mt-6 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
          Back home
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: "#0f172a", color: "#fff", fontSize: "14px" },
              success: { iconTheme: { primary: "#22c55e", secondary: "#fff" } },
              error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
            }}
          />
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/register" element={
                <RoleGate allow={["Admin"]}><RegisterPage /></RoleGate>
              } />

              <Route path="/vehicles" element={<VehiclesListPage />} />
              <Route path="/vehicles/new" element={
                <RoleGate allow={["Admin", "Fleet Manager"]}><VehicleFormPage mode="create" /></RoleGate>
              } />
              <Route path="/vehicles/:id" element={<VehicleDetailsPage />} />
              <Route path="/vehicles/:id/edit" element={
                <RoleGate allow={["Admin", "Fleet Manager"]}><VehicleFormPage mode="edit" /></RoleGate>
              } />

              <Route path="/drivers" element={<DriversListPage />} />
              <Route path="/drivers/new" element={
                <RoleGate allow={["Admin", "Fleet Manager"]}><DriverFormPage mode="create" /></RoleGate>
              } />
              <Route path="/drivers/:id" element={<DriverDetailsPage />} />
              <Route path="/drivers/:id/edit" element={
                <RoleGate allow={["Admin", "Fleet Manager"]}><DriverFormPage mode="edit" /></RoleGate>
              } />

              <Route path="/trips" element={
                <RoleGate allow={["Admin", "Fleet Manager", "Dispatcher"]}><TripsListPage /></RoleGate>
              } />
              <Route path="/trips/new" element={
                <RoleGate allow={["Admin", "Fleet Manager", "Dispatcher"]}><TripFormPage /></RoleGate>
              } />
              <Route path="/trips/:id" element={
                <RoleGate allow={["Admin", "Fleet Manager", "Dispatcher"]}><TripDetailsPage /></RoleGate>
              } />

              <Route path="/maintenance" element={<MaintenanceListPage />} />
              <Route path="/maintenance/new" element={
                <RoleGate allow={["Admin", "Fleet Manager"]}><MaintenanceFormPage /></RoleGate>
              } />
              <Route path="/maintenance/:id" element={<MaintenanceDetailsPage />} />

              <Route path="/fuel" element={<FuelListPage />} />
              <Route path="/fuel/new" element={
                <RoleGate allow={["Admin", "Fleet Manager"]}><FuelFormPage /></RoleGate>
              } />
              <Route path="/fuel/:id" element={<FuelDetailsPage />} />

              <Route path="/expenses" element={<ExpensesListPage />} />
              <Route path="/expenses/new" element={
                <RoleGate allow={["Admin", "Fleet Manager"]}><ExpenseFormPage mode="create" /></RoleGate>
              } />
              <Route path="/expenses/:id" element={<ExpenseDetailsPage />} />
              <Route path="/expenses/:id/edit" element={
                <RoleGate allow={["Admin", "Fleet Manager"]}><ExpenseFormPage mode="edit" /></RoleGate>
              } />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
