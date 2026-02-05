import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';

import Navbar from './components/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import PGList from './components/PG/PGList';
import BookingList from './components/Booking/BookingList';
import ReviewForm from './components/Review/ReviewForm';
import PGDetails from './pages/PGDetails';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import Donation from './pages/Donation';
import AdminDashboard from './pages/AdminDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import DonorDashboard from './pages/DonorDashboard';
import ContactUs from './pages/ContactUs';
import MyReviews from './pages/MyReviews';
import ReviewPage from './pages/ReviewPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleBasedRoute } from './components/RoleBasedRoute';
import APITest from './components/APITest';
// import ConnectionStatus from './components/ConnectionStatus';
import { AuthProvider } from './context/AuthContext';
import Footer from './components/Footer';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: var(--bg-color);
`;

const MainContent = styled.main`
  padding-top: 80px;
  min-height: calc(100vh - 80px);
`;

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppContainer>
                    {/* <ConnectionStatus /> */}
                    <Navbar />
                    <MainContent>
                        <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" />} />
                            <Route path="/test" element={<APITest />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/admin" element={
                                <RoleBasedRoute allowedRoles={['Admin']}>
                                    <AdminDashboard />
                                </RoleBasedRoute>
                            } />
                            <Route path="/owner-dashboard" element={
                                <RoleBasedRoute allowedRoles={['Owner']}>
                                    <OwnerDashboard />
                                </RoleBasedRoute>
                            } />
                            <Route path="/donor-dashboard" element={
                                <RoleBasedRoute allowedRoles={['Donor']}>
                                    <DonorDashboard />
                                </RoleBasedRoute>
                            } />
                            <Route path="/pgs" element={<PGList />} />
                            <Route path="/pgs/:id" element={<PGDetails />} />
                            <Route path="/pg/:id" element={<PGDetails />} />
                            <Route path="/bookings" element={<BookingList />} />
                            <Route path="/booking/:pgId" element={<Booking />} />
                            <Route path="/payment/:bookingId" element={<Payment />} />
                            <Route path="/donation" element={<Donation />} />
                            <Route path="/reviews" element={<MyReviews />} />
                            <Route path="/reviews/:pgId" element={<ReviewPage />} />
                            <Route path="/contact" element={<ContactUs />} />
                        </Routes>
                    </MainContent>
                    <Footer />
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                </AppContainer>
            </Router>
        </AuthProvider>
    );
}

export default App;
