// src/components/Dashboard/Dashboard.js
import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 80vh;
`;

const WelcomeCard = styled.div`
  background: var(--gradient-primary);
  padding: 4rem 2rem;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  overflow: hidden;
  color: white;

  /* Decorative Circles */
  &::before {
    content: '';
    position: absolute;
    top: -50px;
    left: -50px;
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -50px;
    right: -50px;
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }
`;

const Title = styled.h1`
  color: white;
  margin-bottom: 1rem;
  font-size: 3rem;
  font-weight: 800;
  text-shadow: 0 4px 6px rgba(0,0,0,0.1);

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.25rem;
  margin-bottom: 2.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const QuickSearchContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  max-width: 700px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem;
  border-radius: 60px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  
  input {
    flex: 1;
    padding: 1rem 2rem;
    border-radius: 50px;
    border: none;
    font-size: 1.1rem;
    background: white;
    color: var(--text-main);
    transition: all 0.2s;
    
    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.5);
    }
  }

  button {
    padding: 0 2.5rem;
    border-radius: 50px;
    border: none;
    background: var(--text-main);
    color: white;
    font-weight: 600;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    
    &:hover {
      background: black;
      transform: translateY(-2px);
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    background: transparent;
    border: none;
    backdrop-filter: none;
    
    input { width: 100%; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    button { width: 100%; padding: 1rem; margin-top: 0.5rem; }
  }
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: -3rem; /* Overlap effect */
  position: relative;
  z-index: 5;
  padding: 0 1rem;
`;

const ActionCard = styled(Link)`
  background: var(--surface-color);
  padding: 2.5rem;
  border-radius: var(--radius-xl);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  text-decoration: none;
  color: var(--text-main);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255,255,255,0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 25px 50px -12px rgba(14, 165, 233, 0.25);
    border-color: var(--primary-light);
  }
`;

const ActionIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 4px 6px rgba(14, 165, 233, 0.2));
`;

const ActionTitle = styled.h3`
  margin-bottom: 0.5rem;
  color: var(--text-main);
  font-size: 1.4rem;
  font-weight: 700;
`;

const ActionDescription = styled.p`
  color: var(--text-light);
  line-height: 1.6;
  font-size: 0.95rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 5rem;
  text-align: center;
`;

const StatCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  transition: transform 0.3s;
  border: 1px solid var(--glass-border);

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }
`;

const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StatLabel = styled.div`
  font-size: 1.1rem;
  color: var(--text-light);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Dashboard = () => {
  const { isAuthenticated, user, isAdmin, isOwner } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (isAdmin) return <Navigate to="/admin" />;
  if (isOwner) return <Navigate to="/owner-dashboard" />;

  const handleSearch = () => {
    navigate(`/pgs?search=${searchTerm}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <Container>
      <WelcomeCard>
        <Title>Welcome to PG Finder</Title>
        <Subtitle>Hello {user?.fullName?.split(' ')[0] || 'User'}, find your perfect stay today.</Subtitle>

        <QuickSearchContainer>
          <input
            type="text"
            placeholder="Enter location, city, or PG name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleSearch}>Search</button>
        </QuickSearchContainer>
      </WelcomeCard>

      <ActionsGrid>
        <ActionCard to="/pgs">
          <ActionIcon>🏠</ActionIcon>
          <ActionTitle>Find PGs</ActionTitle>
          <ActionDescription>
            Browse through available PG accommodations in your preferred location
          </ActionDescription>
        </ActionCard>

        <ActionCard to="/bookings">
          <ActionIcon>📋</ActionIcon>
          <ActionTitle>My Bookings</ActionTitle>
          <ActionDescription>
            View and manage your current and past PG bookings
          </ActionDescription>
        </ActionCard>

        <ActionCard to="/reviews">
          <ActionIcon>⭐</ActionIcon>
          <ActionTitle>Reviews</ActionTitle>
          <ActionDescription>
            Read reviews from other tenants and share your experience
          </ActionDescription>
        </ActionCard>

        <ActionCard to="/contact">
          <ActionIcon>👥</ActionIcon>
          <ActionTitle>Meet The Team</ActionTitle>
          <ActionDescription>
            Get to know the team behind PG Finder and contact us
          </ActionDescription>
        </ActionCard>
      </ActionsGrid>

      <StatsGrid>
        <StatCard>
          <StatNumber>500+</StatNumber>
          <StatLabel>Available PGs</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>1000+</StatNumber>
          <StatLabel>Happy Customers</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>50+</StatNumber>
          <StatLabel>Cities Covered</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>24/7</StatNumber>
          <StatLabel>Support Available</StatLabel>
        </StatCard>
      </StatsGrid>
    </Container>
  );
};

export default Dashboard;
