import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { pgAPI } from '../../services/api';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  color: white;
  text-align: center;
  margin-bottom: 2rem;
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

const AdminPGs = () => {
  const [pgs, setPGs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPGs();
  }, []);

  const fetchPGs = async () => {
    try {
      const response = await pgAPI.getAllPGs();
      setPGs(response.data);
    } catch (error) {
      toast.error('Failed to fetch PGs');
    } finally {
      setLoading(false);
    }
  };

  const deletePG = async (pgId) => {
    if (window.confirm('Are you sure you want to delete this PG?')) {
      try {
        await pgAPI.deletePG(pgId);
        toast.success('PG deleted successfully');
        fetchPGs();
      } catch (error) {
        toast.error('Failed to delete PG');
      }
    }
  };

  if (loading) return <Container><Title>Loading PGs...</Title></Container>;

  return (
    <Container>
      <Title>Manage PGs</Title>
      <Table>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Name</Th>
            <Th>Address</Th>
            <Th>Rent</Th>
            <Th>Available Rooms</Th>
            <Th>Owner</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {pgs.map(pg => (
            <tr key={pg.pgId}>
              <Td>{pg.pgId}</Td>
              <Td>{pg.name}</Td>
              <Td>{pg.address}</Td>
              <Td>₹{pg.rent}</Td>
              <Td>{pg.availableRooms}</Td>
              <Td>{pg.owner?.fullName}</Td>
              <Td>
                <Button onClick={() => deletePG(pg.pgId)} danger>
                  Delete
                </Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminPGs;