// src/components/PG/PGList.js
import React, { useState, useEffect } from 'react';
import { Navigate, Link, useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { bookingAPI, pgAPI } from '../../services/api';
import PGMap from './PGMap';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  text-align: center;
  color: var(--text-main);
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: 800;
  
  span {
    color: var(--primary);
  }
`;

// --- Search & Filter Styles ---
const FilterBar = styled.div`
  background: var(--surface-color);
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  margin-bottom: 3rem;
  box-shadow: var(--shadow-md);
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  border: 1px solid rgba(0,0,0,0.05);
`;

const SearchInput = styled.div`
  flex: 2;
  min-width: 250px;
  
  input {
    width: 100%;
    padding: 0.8rem;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    font-size: 1rem;
    &:focus { outline: none; border-color: #667eea; }
  }
`;

const FilterSelect = styled.select`
  flex: 1;
  min-width: 150px;
  padding: 0.8rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  background: white;
  &:focus { outline: none; border-color: #667eea; }
`;

const PGGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
`;

const PGCard = styled.div`
  background: var(--surface-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
  border: 1px solid rgba(0,0,0,0.05);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-xl);
  }
`;

const PGImage = styled.div`
  height: 200px;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 4rem;
  position: relative;
`;

const Badge = styled.span`
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255,255,255,0.95);
  color: var(--primary);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  box-shadow: var(--shadow-sm);
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const PGName = styled.h3`
  color: var(--text-main);
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 700;
`;

const Location = styled.div`
  color: var(--text-light);
  font-size: 0.9rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const Features = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const FeatureTag = styled.span`
  background: #f1f5f9;
  color: var(--text-light);
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-size: 0.8rem;
  border: 1px solid #e2e8f0;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Rent = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--primary);
  span { font-size: 0.9rem; color: var(--text-light); font-weight: normal; }
`;

const ActionRow = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 0.75rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.variant === 'outline' ? `
    border: 2px solid var(--primary);
    background: transparent;
    color: var(--primary);
    &:hover { background: #e0e7ff; }
  ` : `
    border: none;
    background: var(--primary);
    color: white;
    &:hover { background: var(--primary-dark); }
    &:disabled { opacity: 0.6; cursor: not-allowed; }
  `}
`;

const NoResultsMessage = styled.div`
  text-align: center;
  color: #4a5568;
  background: white;
  padding: 2rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  
  h3 { margin-top: 0; color: #2d3748; }
  p { margin-bottom: 0; }
`;

const ViewToggle = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
`;

const ToggleButton = styled.button`
  background: ${props => props.active ? 'var(--primary)' : 'white'};
  color: ${props => props.active ? 'white' : 'var(--text-light)'};
  border: 1px solid #e2e8f0;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:first-child {
    border-top-left-radius: var(--radius-md);
    border-bottom-left-radius: var(--radius-md);
  }
  
  &:last-child {
    border-top-right-radius: var(--radius-md);
    border-bottom-right-radius: var(--radius-md);
  }

  &:hover {
    background: ${props => props.active ? 'var(--primary-dark)' : '#f1f5f9'};
  }
`;

const PGList = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [pgs, setPgs] = useState([]);
  const [filteredPGs, setFilteredPGs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(null);
  const [resultMessage, setResultMessage] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  // Photo Modal State
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [currentPhotos, setCurrentPhotos] = useState([]);
  const [currentPGName, setCurrentPGName] = useState('');
  const navigate = useNavigate();

  // Filters
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [cityFilter, setCityFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('price-asc');
  const [genderFilter, setGenderFilter] = useState('All');

  useEffect(() => {
    fetchPGs();
  }, []);

  const fetchPGs = async () => {
    try {
      const response = await pgAPI.getAllPGs();
      setPgs(response.data);
      setFilteredPGs(response.data);
    } catch (error) {
      toast.error('Failed to fetch PGs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pgs.length > 0) {
      console.log("PG Data Debug:", pgs[0]);
    }
  }, [pgs]);

  useEffect(() => {
    if (searchParams.get('search')) {
      setSearchTerm(searchParams.get('search') || '');
    }
  }, [searchParams]);

  useEffect(() => {
    let result = [...pgs];
    let matchedInitialSearch = true;

    // Filter by Search (Name or Area)
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      const searchResult = result.filter(pg =>
        (pg.name && pg.name.toLowerCase().includes(lowerTerm)) ||
        (pg.area && pg.area.toLowerCase().includes(lowerTerm)) ||
        (pg.city && pg.city.toLowerCase().includes(lowerTerm))
      );

      if (searchResult.length > 0) {
        result = searchResult;
        setResultMessage(null);
      } else {
        matchedInitialSearch = false;
        // Logic: if search term provided but no matches, keep ALL and show message
        setResultMessage(`No PGs found matching "${searchTerm}". Showing all available options.`);
      }
    } else {
      setResultMessage(null);
    }

    // Only apply other filters if the initial search "matched" (or if we are showing all)
    // Actually, usually users expect filters to apply to the 'fallback' list too.

    // Filter by City
    if (cityFilter) {
      result = result.filter(pg => pg.city.toLowerCase() === cityFilter.toLowerCase());
    }

    // Filter by Gender
    // Filter by Gender
    if (genderFilter !== 'All') {
      result = result.filter(pg => {
        const pgGender = pg.genderAllowed || pg.gender || '';
        return pgGender === genderFilter || pgGender === 'Both' || pgGender === 'Co-ed';
      });
    }

    // Sorting
    if (sortOrder === 'price-asc') {
      result.sort((a, b) => a.rent - b.rent);
    } else if (sortOrder === 'price-desc') {
      result.sort((a, b) => b.rent - a.rent);
    }

    setFilteredPGs(result);
  }, [pgs, searchTerm, cityFilter, sortOrder, genderFilter]);

  if (!isAuthenticated) return <Navigate to="/login" />;

  const handleBooking = async (pgId) => {
    setBookingLoading(pgId);
    try {
      const response = await bookingAPI.createBooking(pgId);
      const booking = response.data;
      navigate(`/payment/${booking.bookingId}`, { state: { booking } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(null);
    }
  };

  const handleViewPhotos = (pg) => {
    const photos = pg.images && pg.images.length > 0
      ? pg.images
      : [
        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=1273&q=80'
      ];
    setCurrentPhotos(photos);
    setCurrentPGName(pg.name);
    setShowPhotoModal(true);
  };

  const cities = Array.from(new Set(pgs.map(pg => pg.city)));

  if (loading) return <Container><h2 style={{ color: 'white', textAlign: 'center' }}>Loading PGs...</h2></Container>;

  return (
    <Container>
      <Title>Find Your <span>Perfect Stay</span></Title>

      <FilterBar>
        <SearchInput>
          <input
            type="text"
            placeholder="Search by area, landmark, or PG name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchInput>

        <FilterSelect value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
          <option value="">All Cities</option>
          {cities.map(city => <option key={city} value={city}>{city}</option>)}
        </FilterSelect>

        <FilterSelect value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
          <option value="All">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Both">Co-ed</option>
        </FilterSelect>

        <FilterSelect value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </FilterSelect>
      </FilterBar>

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

      {resultMessage && (
        <NoResultsMessage>
          <h3>Note</h3>
          <p>{resultMessage}</p>
        </NoResultsMessage>
      )}

      {filteredPGs.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'white', fontSize: '1.2rem', marginTop: '2rem' }}>
          No PGs found matching your specific filters.
        </div>
      ) : viewMode === 'map' ? (
        <PGMap
          pgs={filteredPGs}
          onPGSelect={(pgId) => navigate(`/pgs/${pgId}`)}
        />
      ) : (
        <PGGrid>
          {filteredPGs.map((pg) => (
            <PGCard key={pg.pgId}>
              <PGImage>
                🏠
                {/* Fix: Relax availability check. If numbers are 0 but user says it's available, trust basic activeness or fallback. */}
                {(pg.availableRooms || pg.availableSlots || pg.totalRooms || 0) > 0 ? (
                  <Badge>
                    {pg.availableRooms ? `Available: ${pg.availableRooms} Vacancies` : 'Available'}
                  </Badge>
                ) : (
                  <Badge>Full</Badge>
                )}
              </PGImage>
              <CardContent>
                <PGName>{pg.name}</PGName>
                <Location>📍 {pg.area}, {pg.city}</Location>

                <Features>
                  <FeatureTag>{pg.genderAllowed || pg.gender || 'N/A'}</FeatureTag>
                  <FeatureTag>Furnished</FeatureTag>
                  <FeatureTag>WiFi</FeatureTag>
                </Features>

                <PriceRow>
                  <Rent>₹{(pg.rent || pg.price || 0).toLocaleString()}<span>/mo</span></Rent>
                </PriceRow>

                <ActionRow>
                  <Button variant="outline" as={Link} to={`/pgs/${pg.pgId}`} style={{ textDecoration: 'none', textAlign: 'center' }}>
                    Details
                  </Button>
                  <Button
                    onClick={() => handleBooking(pg.pgId)}
                    disabled={bookingLoading === pg.pgId || (pg.availableSlots === 0 && pg.availableRooms === 0)}
                  >
                    {bookingLoading === pg.pgId ? 'Processing...' : 'Book Now'}
                  </Button>
                </ActionRow>
              </CardContent>
            </PGCard>
          ))}
        </PGGrid>
      )}

      {/* Photo Modal */}
      {showPhotoModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }} onClick={() => setShowPhotoModal(false)}>
          <div style={{
            background: 'white', padding: '1rem', borderRadius: '15px',
            maxWidth: '800px', width: '90%', maxHeight: '90vh', overflowY: 'auto'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>Photos: {currentPGName}</h3>
              <button onClick={() => setShowPhotoModal(false)} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {currentPhotos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`View ${index + 1}`}
                  style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default PGList;