import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import RequestPickupPage from './pages/RequestPickupPage';
import TrackingPage from './pages/TrackingPage';
import MyRequestsPage from './pages/MyRequestsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

export default function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/request" element={<RequestPickupPage />} />
          <Route path="/track" element={<TrackingPage />} />
          <Route path="/my-requests" element={<MyRequestsPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
