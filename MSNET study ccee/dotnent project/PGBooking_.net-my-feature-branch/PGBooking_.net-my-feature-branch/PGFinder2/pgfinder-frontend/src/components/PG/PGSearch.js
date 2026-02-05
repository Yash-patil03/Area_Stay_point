import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { pgAPI, bookingAPI } from '../../services/api';
import PGMap from './PGMap';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const SearchContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e1e8ed;
  border-radius: 10px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const SearchButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
`;

const PGGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
`;

const PGCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const PGName = styled.h3`
  color: #333;
  margin-bottom: 0.5rem;
`;

const PGDetails = styled.div`
  color: #666;
  margin-bottom: 1rem;
`;

const PGRent = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Button = styled.button`
  flex: 1;
  background: ${props => props.variant === 'secondary' ? '#6c757d' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    opacity: 0.8;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
`;

const ToggleButton = styled.button`
  background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  border: 1px solid #ddd;
  padding: 0.5rem 1rem;
  cursor: pointer;
  
  &:first-child {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }
  
  &:last-child {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;

const PGSearch = () => {
  const navigate = useNavigate();
  const [pgs, setPGs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(null);
  const [filters, setFilters] = useState({
    city: '',
    area: '',
    maxRent: ''
  });
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

  useEffect(() => {
    searchPGs();
  }, []);

  const searchPGs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.city) params.city = filters.city;
      if (filters.area) params.area = filters.area;
      if (filters.maxRent) params.maxRent = filters.maxRent;

      const response = await pgAPI.getAllPGs(params);
      setPGs(response.data);
    } catch (error) {
      toast.error('Failed to load PGs');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleBooking = async (pgId) => {
    setBookingLoading(pgId);
    try {
      await bookingAPI.createBooking(pgId);
      toast.success('Booking request sent successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(null);
    }
  };

  return (
    <Container>
      <SearchContainer>
        <Input
          type="text"
          name="city"
          placeholder="Search by city..."
          value={filters.city}
          onChange={handleFilterChange}
        />
        <Input
          type="text"
          name="area"
          placeholder="Search by area..."
          value={filters.area}
          onChange={handleFilterChange}
        />
        <Input
          type="number"
          name="maxRent"
          placeholder="Max rent..."
          value={filters.maxRent}
          onChange={handleFilterChange}
        />
        <SearchButton onClick={searchPGs} disabled={loading}>
          {loading ? 'Searching...' : 'Search PGs'}
        </SearchButton>
      </SearchContainer>

      <ViewToggle>
        <ToggleButton
          active={viewMode === 'list'}
          onClick={() => setViewMode('list')}
        >
          List View
        </ToggleButton>
        <ToggleButton
          active={viewMode === 'map'}
          onClick={() => setViewMode('map')}
        >
          Map View
        </ToggleButton>
      </ViewToggle>

      {loading ? (
        <div style={{ textAlign: 'center', color: 'white', fontSize: '1.2rem' }}>
          Loading PGs...
        </div>
      ) : viewMode === 'map' ? (
        <PGMap
          pgs={pgs}
          onPGSelect={(pgId) => navigate(`/pg/${pgId}`)}
        />
      ) : (
        <PGGrid>
          {pgs.map(pg => (
            <PGCard key={pg.pgId}>
              <PGName>{pg.name}</PGName>
              <PGDetails>
                <div>📍 {pg.address}, {pg.city}</div>
                <div>🏠 {pg.pgType} • {pg.gender}</div>
                <div>🛏️ {pg.availableRooms} available of {pg.totalRooms} rooms</div>
                {pg.owner && <div>👤 {pg.owner.fullName}</div>}
              </PGDetails>
              <PGRent>₹{pg.rent}/month</PGRent>
              <ButtonGroup>
                <Button
                  onClick={() => handleBooking(pg.pgId)}
                  disabled={bookingLoading === pg.pgId || pg.availableRooms === 0}
                >
                  {bookingLoading === pg.pgId ? 'Booking...' :
                    pg.availableRooms === 0 ? 'No Rooms' : 'Book Now'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/pg/${pg.pgId}`)}
                >
                  View Details
                </Button>
              </ButtonGroup>
            </PGCard>
          ))}
        </PGGrid>
      )}

      {!loading && pgs.length === 0 && (
        <div style={{ textAlign: 'center', color: 'white', fontSize: '1.2rem' }}>
          No PGs found. Try adjusting your search criteria.
        </div>
      )}
    </Container>
  );
};

export default PGSearch;