import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { pgAPI, bookingAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const PGCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ImageSection = styled.div`
  height: 400px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
`;

const ContentSection = styled.div`
  padding: 2rem;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 1rem;
  font-size: 2.5rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const InfoCard = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 15px;
  border-left: 4px solid #667eea;
`;

const InfoTitle = styled.h3`
  color: #333;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const InfoText = styled.p`
  color: #666;
  margin: 0.5rem 0;
  font-size: 1rem;
`;

const Price = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #667eea;
  margin: 1rem 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  background: ${props => props.variant === 'secondary' ? '#6c757d' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 1.2rem;
  color: #667eea;
`;

const PGDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [pg, setPG] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    fetchPGDetails();
  }, [id]);

  const fetchPGDetails = async () => {
    try {
      const response = await pgAPI.getPG(id);
      setPG(response.data);
    } catch (error) {
      toast.error('Failed to load PG details');
      navigate('/pgs');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book a PG');
      navigate('/login');
      return;
    }

    setBooking(true);
    try {
      await bookingAPI.createBooking(id);
      toast.success('Booking request sent successfully!');
      navigate('/bookings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingSpinner>Loading PG details...</LoadingSpinner>
      </Container>
    );
  }

  if (!pg) {
    return (
      <Container>
        <div>PG not found</div>
      </Container>
    );
  }

  return (
    <Container>
      <PGCard>
        <ImageSection>
          <div>📸 PG Images Coming Soon</div>
        </ImageSection>

        <ContentSection>
          <Title>{pg.name}</Title>
          <Price>₹{(pg.rent || 0).toLocaleString()}/month</Price>

          <InfoGrid>
            <InfoCard>
              <InfoTitle>📍 Location Details</InfoTitle>
              <InfoText><strong>Address:</strong> {pg.address}</InfoText>
              <InfoText><strong>City:</strong> {pg.city}</InfoText>
              <InfoText><strong>State:</strong> {pg.state}</InfoText>
              <InfoText><strong>Pincode:</strong> {pg.pincode}</InfoText>
            </InfoCard>

            <InfoCard>
              <InfoTitle>🏠 Property Details</InfoTitle>
              <InfoText><strong>Type:</strong> {pg.pgType}</InfoText>
              <InfoText><strong>Available Rooms:</strong> {pg.availableRooms}</InfoText>
              <InfoText><strong>Total Rooms:</strong> {pg.totalRooms}</InfoText>
              <InfoText><strong>Gender:</strong> {pg.gender}</InfoText>
            </InfoCard>

            <InfoCard>
              <InfoTitle>🛏️ Room Features</InfoTitle>
              <InfoText><strong>AC Available:</strong> {pg.isAC ? 'Yes' : 'No'}</InfoText>
              <InfoText><strong>WiFi:</strong> {pg.hasWiFi ? 'Available' : 'Not Available'}</InfoText>
              <InfoText><strong>Parking:</strong> {pg.hasParking ? 'Available' : 'Not Available'}</InfoText>
              <InfoText><strong>Laundry:</strong> {pg.hasLaundry ? 'Available' : 'Not Available'}</InfoText>
            </InfoCard>

            <InfoCard>
              <InfoTitle>🍽️ Meal Information</InfoTitle>
              <InfoText><strong>Meals Included:</strong> {pg.mealsIncluded ? 'Yes' : 'No'}</InfoText>
              <InfoText><strong>Kitchen Access:</strong> {pg.hasKitchen ? 'Available' : 'Not Available'}</InfoText>
            </InfoCard>

            <InfoCard>
              <InfoTitle>📞 Contact Information</InfoTitle>
              <InfoText><strong>Owner:</strong> {pg.owner?.fullName || 'N/A'}</InfoText>
              <InfoText><strong>Phone:</strong> {pg.owner?.phone || 'N/A'}</InfoText>
              <InfoText><strong>Email:</strong> {pg.owner?.email || 'N/A'}</InfoText>
            </InfoCard>

            <InfoCard>
              <InfoTitle>ℹ️ Additional Information</InfoTitle>
              <InfoText><strong>Security Deposit:</strong> ₹{pg.securityDeposit || 'N/A'}</InfoText>
              <InfoText><strong>Notice Period:</strong> {pg.noticePeriod || 'N/A'} days</InfoText>
              <InfoText><strong>Available From:</strong> {pg.availableFrom ? new Date(pg.availableFrom).toLocaleDateString() : 'Immediately'}</InfoText>
            </InfoCard>
          </InfoGrid>

          {pg.description && (
            <InfoCard>
              <InfoTitle>📝 Description</InfoTitle>
              <InfoText>{pg.description}</InfoText>
            </InfoCard>
          )}

          <ButtonGroup>
            <Button onClick={handleBooking} disabled={booking || pg.availableRooms === 0}>
              {booking ? 'Booking...' : pg.availableRooms === 0 ? 'No Rooms Available' : 'Book Now'}
            </Button>
            <Button variant="secondary" onClick={() => navigate('/pgs')}>
              Back to Listings
            </Button>
          </ButtonGroup>
        </ContentSection>
      </PGCard>
    </Container>
  );
};

export default PGDetails;