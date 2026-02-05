import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const Navbar = styled.nav`
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  position: sticky;
  top: 0;
  z-index: 999;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  width: 100%;
  max-width: 1200px;
  padding: 0 2rem;
`;

const Logo = styled(Link)`
  color: var(--primary);
  justify-self: start;
  cursor: pointer;
  text-decoration: none;
  font-size: 1.8rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  letter-spacing: -0.5px;
  
  span {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const NavMenu = styled.ul`
  display: flex;
  align-items: center;
  list-style: none;
  text-align: center;
  gap: 2rem;
  margin: 0;

  @media screen and (max-width: 960px) {
    display: none;
  }
`;

const NavItem = styled.li`
  height: 80px;
`;

const NavLinks = styled(Link)`
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  height: 100%;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: var(--primary);
  }
`;

const NavBtn = styled.nav`
  display: flex;
  align-items: center;
  margin-left: 24px;

  @media screen and (max-width: 960px) {
    display: none;
  }
`;

const NavBtnLink = styled(Link)`
  border-radius: 50px;
  background: var(--gradient-primary);
  white-space: nowrap;
  padding: 10px 24px;
  color: #fff;
  font-size: 16px;
  outline: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  font-weight: 600;
  box-shadow: var(--shadow-glow);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(14, 165, 233, 0.4);
    filter: brightness(1.1);
    color: #fff;
  }
`;

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar>
      <NavContainer>
        <Logo to="/">
          <span>PG</span>Finder
        </Logo>
        <NavMenu>
          <NavItem>
            <NavLinks to="/">Home</NavLinks>
          </NavItem>
          <NavItem>
            <NavLinks to="/pgs">Find PG</NavLinks>
          </NavItem>
          {user && (
            <>
              <NavItem>
                <NavLinks to={user.role === 'Owner' ? '/owner-dashboard' : '/dashboard'}>
                  Dashboard
                </NavLinks>
              </NavItem>
            </>
          )}
        </NavMenu>
        <NavBtn>
          {user ? (
            <NavBtnLink as="button" onClick={handleLogout}>Logout</NavBtnLink>
          ) : (
            <NavBtnLink to="/login">Sign In</NavBtnLink>
          )}
        </NavBtn>
      </NavContainer>
    </Navbar>
  );
};

export default Header;
