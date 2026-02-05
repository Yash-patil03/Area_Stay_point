// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: var(--shadow-sm);
  z-index: 1000;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--primary);
  text-decoration: none;
  letter-spacing: -0.5px;
  
  &:hover {
    color: var(--primary-dark);
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: var(--text-main);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  
  &:hover {
    color: var(--primary);
  }
`;

const Button = styled.button`
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: var(--radius-lg);
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-md);
  
  &:hover {
    background: var(--primary-dark);
    transform: translateY(-1px);
    box-shadow: var(--shadow-lg);
  }
`;

const Navbar = () => {
    const { isAuthenticated, logout, user, isAdmin, isOwner } = useAuth();
    const navigate = useNavigate();

    // Force logout if data is corrupted (authenticated but no role/name)
    React.useEffect(() => {
        if (isAuthenticated && (!user?.role || !user?.email)) {
            console.warn('User data corrupted, forcing logout');
            logout();
            navigate('/login');
        }
    }, [isAuthenticated, user, logout, navigate]);

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully!');
        navigate('/login');
    };

    return (
        <NavbarContainer>
            <Logo to="/">PG Finder</Logo>
            <NavLinks>
                {isAuthenticated ? (
                    <>
                        <NavLink to="/dashboard">Dashboard</NavLink>

                        {isAdmin && (
                            <>
                                <NavLink to="/admin">Admin Dashboard</NavLink>
                            </>
                        )}

                        {isOwner && (
                            <>
                                <NavLink to="/owner-dashboard">Owner Dashboard</NavLink>
                                {/* <NavLink to="/owner/pgs">My PGs</NavLink> */}
                            </>
                        )}

                        {user?.role === 'Donor' && (
                            <NavLink to="/donor-dashboard">Donor Dashboard</NavLink>
                        )}

                        {!isAdmin && !isOwner && (
                            <>
                                <NavLink to="/pgs">Find PGs</NavLink>
                                <NavLink to="/contact">About Us</NavLink>
                                <NavLink to="/bookings">My Bookings</NavLink>
                            </>
                        )}

                        <span>Welcome, {user?.fullName || user?.email} ({user?.role})</span>
                        <Button onClick={handleLogout}>Logout</Button>
                    </>
                ) : (
                    <>
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/contact">About Us</NavLink>
                        <NavLink to="/login">Login</NavLink>
                        <NavLink to="/register">Register</NavLink>
                    </>
                )}
            </NavLinks>
        </NavbarContainer >
    );
};

export default Navbar;
