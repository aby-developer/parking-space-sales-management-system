import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";

import MainLayout from "./layout/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Cars from "./pages/Car";
import Slots from "./pages/Slot";
import Parking from "./pages/ParkingRecord";
import Payments from "./pages/Payment";
import DailyReport from "./pages/DailyReport";
import Login from "./pages/Login";

export default function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route
                        element={
                            <ProtectedRoute>
                                <MainLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/cars" element={<Cars />} />
                        <Route path="/slots" element={<Slots />} />
                        <Route path="/parking" element={<Parking />} />
                        <Route path="/payments" element={<Payments />} />
                        <Route path="/reports" element={<DailyReport />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}