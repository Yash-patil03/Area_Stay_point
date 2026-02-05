import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { ownerAPI } from '../../services/api';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  color: white;
  text-align: center;
  margin-bottom: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  opacity: 0.9;
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const ActionCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ActionIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const ActionTitle = styled.h3`
  color: #333;
  margin-bottom: 1rem;
`;

const ActionDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

const Table = styled.table`
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  text-align: left;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #eee;
`;

const Button = styled.button`
  background: ${props => props.danger ? '#dc3545' : '#667eea'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 0.5rem;
  
  &:hover {
    opacity: 0.8;
  }
`;

const OwnerPanel = () => {
  const navigate = useNavigate();
  const [pgs, setPGs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPGs: 0,
    totalRooms: 0,
    availableRooms: 0,
    occupancyRate: 0
  });

  useEffect(() => {
    fetchOwnerData();
  }, []);

  const fetchOwnerData = async () => {
    try {
      const response = await ownerAPI.getMyPGs();
      setPGs(response.data);
      
      // Calculate stats
      const totalPGs = response.data.length;
      const totalRooms = response.data.reduce((sum, pg) => sum + (pg.totalRooms || 0), 0);
      const availableRooms = response.data.reduce((sum, pg) => sum + (pg.availableRooms || 0), 0);
      const occupancyRate = totalRooms > 0 ? Math.round(((totalRooms - availableRooms) / totalRooms) * 100) : 0;
      
      setStats({ totalPGs, totalRooms, availableRooms, occupancyRate });
    } catch (error) {
      toast.error('Failed to fetch owner data');
    } finally {
      setLoading(false);
    }
  };

  const deletePG = async (pgId) => {
    if (window.confirm('Are you sure you want to delete this PG?')) {
      try {
        await ownerAPI.deletePG(pgId);
        toast.success('PG deleted successfully');
        fetchOwnerData();
      } catch (error) {
        toast.error('Failed to delete PG');
      }
    }
  };

  if (loading) return <Container><Title>Loading...</Title></Container>;

  return (
    <Container>
      <Title>Owner Dashboard</Title>
      
      <StatsGrid>
        <StatCard>
          <StatNumber>{stats.totalPGs}</StatNumber>
          <StatLabel>Total PGs</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.totalRooms}</StatNumber>
          <StatLabel>Total Rooms</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.availableRooms}</StatNumber>
          <StatLabel>Available Rooms</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.occupancyRate}%</StatNumber>
          <StatLabel>Occupancy Rate</StatLabel>
        </StatCard>
      </StatsGrid>

      <ActionsGrid>
        <ActionCard onClick={() => navigate('/owner/add-pg')}>
          <ActionIcon>➕</ActionIcon>
          <ActionTitle>Add New PG</ActionTitle>
          <ActionDescription>List a new PG accommodation on the platform</ActionDescription>
        </ActionCard>
        
        <ActionCard onClick={() => navigate('/owner/pgs')}>
          <ActionIcon>🏢</ActionIcon>
          <ActionTitle>Manage PGs</ActionTitle>
          <ActionDescription>View, edit and manage all your PG listings</ActionDescription>
        </ActionCard>
        
        <ActionCard onClick={() => navigate('/bookings')}>
          <ActionIcon>📋</ActionIcon>
          <ActionTitle>View Bookings</ActionTitle>
          <ActionDescription>Check bookings and inquiries for your PGs</ActionDescription>
        </ActionCard>
      </ActionsGrid>

      <Title style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Recent PG Listings</Title>
      
      {pgs.length === 0 ? (
        <div style={{ color: 'white', textAlign: 'center', fontSize: '1.2rem' }}>
          No PGs found. Add your first PG listing!
        </div>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>City</Th>
              <Th>Rent</Th>
              <Th>Rooms</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {pgs.slice(0, 5).map(pg => (
              <tr key={pg.pgId}>
                <Td>{pg.name}</Td>
                <Td>{pg.city}</Td>
                <Td>₹{pg.rent}</Td>
                <Td>{pg.availableRooms}/{pg.totalRooms}</Td>
                <Td>
                  <Button onClick={() => navigate(`/owner/edit-pg/${pg.pgId}`)}>
                    Edit
                  </Button>
                  <Button danger onClick={() => deletePG(pg.pgId)}>
                    Delete
                  </Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default OwnerPanel;