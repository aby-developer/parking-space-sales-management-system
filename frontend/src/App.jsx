import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Cars from './pages/Car';
import Slots from './pages/Slot';
import Records from './pages/ParkingRecord';
import Payment from './pages/Payment';

export default function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/car" element={<Cars />} />
          <Route path="/slot" element={<Slots />} />
          <Route path="/records" element={<Records />} />
          <Route path="/payment" element={<Payment />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}