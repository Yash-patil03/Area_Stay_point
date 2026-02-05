// src/pages/PGDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { pgAPI, bookingAPI, discountAPI } from '../services/api';
import PGMap from '../components/PG/PGMap';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  color: #333;
`;

const ContentCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
`;

const HeaderImage = styled.div`
  height: 400px;
  background-color: #e2e8f0;
  background-image: url(${props => props.bg});
  background-size: cover;
  background-position: center;
  position: relative;
  
  ${props => !props.bg && `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 5rem;
  `}
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
  
  img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: 10px;
    cursor: pointer;
    transition: transform 0.2s;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    
    &:hover {
      transform: scale(1.05);
    }
  }
`;

const DetailsBody = styled.div`
  padding: 2.5rem;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`;

const PGName = styled.h1`
  font-size: 2.5rem;
  margin: 0;
  color: #2d3748;
`;

const PriceTag = styled.div`
  text-align: right;
  
  .amount {
    font-size: 2rem;
    font-weight: 700;
    color: #667eea;
  }
  .period {
    color: #718096;
    font-size: 0.9rem;
  }
`;

const Section = styled.div`
  margin-bottom: 2rem;
  
  h3 {
    font-size: 1.2rem;
    color: #4a5568;
    margin-bottom: 1rem;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 0.5rem;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const InfoItem = styled.div`
  .label {
    font-size: 0.85rem;
    color: #718096;
    margin-bottom: 0.25rem;
  }
  .value {
    font-size: 1.1rem;
    font-weight: 600;
    color: #2d3748;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #edf2f7;
`;

const Button = styled.button`
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: transform 0.2s;

  ${props => props.variant === 'secondary' ? `
    background: #edf2f7;
    color: #4a5568;
    &:hover { background: #e2e8f0; }
  ` : `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    &:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(118, 75, 162, 0.4); }
  `}

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const PGDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pg, setPg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [requestDiscount, setRequestDiscount] = useState(false);

  useEffect(() => {
    if (id) {
      loadPGDetails(parseInt(id));
    }
  }, [id]);

  const loadPGDetails = async (pgId) => {
    try {
      const response = await pgAPI.getPG(pgId);
      setPg(response.data);
    } catch (error) {
      toast.error('Failed to load PG details');
      navigate('/pgs');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!pg) return;
    setBookingLoading(true);
    try {
      const response = await bookingAPI.createBooking(pg.pgId);
      const booking = response.data;

      if (requestDiscount) {
        // If user requested discount, create the request immediately
        await discountAPI.requestDiscount({
          userId: booking.userId, // Available in response
          pgId: booking.pgId,
          reason: "Requested during initial booking",
          discountPercent: 10, // Default start, or could be 0 awaiting donor
          status: "Pending"
        });
        toast.success("Booking created! Scholarship request sent to Donors.");
        // Navigate to Booking Details page instead of Payment
        navigate(`/booking/${booking.bookingId}`);
      } else {
        // toast.success("Booking created successfully!"); // Removed as per user request
        navigate(`/payment/${booking.bookingId}`, { state: { booking } });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <Container><h2 style={{ color: 'white', textAlign: 'center' }}>Loading...</h2></Container>;
  if (!pg) return <Container><h2 style={{ color: 'white', textAlign: 'center' }}>PG Not Found</h2></Container>;

  return (
    <Container>
      <ContentCard>
        <HeaderImage bg={pg.images && pg.images.length > 0 ? (typeof pg.images[0] === 'string' ? pg.images[0] : (pg.images[0].imageUrl || pg.images[0].url)) : null}>
          {(!pg.images || pg.images.length === 0) && '🏠'}
        </HeaderImage>
        <DetailsBody>
          <TitleRow>
            <div>
              <PGName>{pg.name}</PGName>
              <div style={{ color: '#718096', marginTop: '0.5rem' }}>
                📍 {pg.address}, {pg.area}, {pg.city}
              </div>
            </div>
            <PriceTag>
              <div className="amount">₹{pg.rent.toLocaleString()}</div>
              <div className="period">per month</div>
            </PriceTag>
          </TitleRow>

          {pg.images && pg.images.length > 0 && (
            <Section>
              <h3>Gallery</h3>
              <GalleryGrid>
                {pg.images.map((img, index) => {
                  const src = typeof img === 'string' ? img : (img.imageUrl || img.url);
                  return (
                    <img
                      key={index}
                      src={src}
                      alt={`${pg.name} view ${index + 1}`}
                      onClick={() => window.open(src, '_blank')}
                    />
                  );
                })}
              </GalleryGrid>
            </Section>
          )}

          {pg.videos && pg.videos.length > 0 && (
            <Section>
              <h3>Video Tour</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {pg.videos.map((videoItem, index) => {
                  const video = typeof videoItem === 'string' ? videoItem : (videoItem.videoUrl || videoItem.url || '');
                  if (!video) return null;

                  const isYoutube = video.includes('youtube.com') || video.includes('youtu.be');

                  if (isYoutube) {
                    const embedUrl = video.replace('watch?v=', 'embed/');
                    return (
                      <iframe
                        key={index}
                        src={embedUrl}
                        title={`Video ${index + 1}`}
                        width="100%"
                        height="250"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ borderRadius: '12px' }}
                      />
                    );
                  }

                  return (
                    <video
                      key={index}
                      controls
                      src={video}
                      style={{ width: '100%', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  );
                })}
              </div>
            </Section>
          )}

          <Section>
            <h3>Property Highlights</h3>
            <InfoGrid>
              <InfoItem>
                <div className="label">Allowed For</div>
                <div className="value">{pg.genderAllowed}</div>
              </InfoItem>
              <InfoItem>
                <div className="label">Total Capacity</div>
                <div className="value">{pg.capacity} Beds</div>
              </InfoItem>
              <InfoItem>
                <div className="label">Availability</div>
                <div className="value" style={{ color: pg.availableSlots > 0 ? '#38a169' : '#e53e3e' }}>
                  {pg.availableSlots} Beds Open
                </div>
              </InfoItem>
              <InfoItem>
                <div className="label">Area</div>
                <div className="value">{pg.area}</div>
              </InfoItem>
            </InfoGrid>
          </Section>

          <Section>
            <h3>Location</h3>
            <div style={{ width: '100%', borderRadius: '15px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
              <PGMap pgs={[pg]} />
            </div>
          </Section>

          <Section>
            <h3>Description</h3>
            <p style={{ lineHeight: '1.6', color: '#4a5568' }}>
              {pg.description || 'No description provided.'}
            </p>
          </Section>

          <div style={{ marginTop: '2rem', padding: '1rem', background: '#fffaf0', border: '1px solid #fbd38d', borderRadius: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontWeight: '500', color: '#2d3748' }}>
              <input
                type="checkbox"
                checked={requestDiscount}
                onChange={(e) => setRequestDiscount(e.target.checked)}
                style={{ width: '1.2rem', height: '1.2rem' }}
              />
              I need financial assistance from a Donor (Apply for Scholarship)
            </label>
            {requestDiscount && (
              <p style={{ margin: '0.5rem 0 0 2rem', fontSize: '0.9rem', color: '#744210' }}>
                After booking, your request will be sent to Donors. You only pay the remaining amount once a Donor approves your request.
              </p>
            )}
          </div>

          <ActionButtons>
            <Button variant="secondary" onClick={() => navigate('/pgs')}>
              Explore more PGs
            </Button>
            <Button onClick={handleBooking} disabled={bookingLoading || pg.availableSlots === 0}>
              {bookingLoading ? 'Processing...' : pg.availableSlots === 0 ? 'Fully Booked' : 'Book This Place'}
            </Button>
          </ActionButtons>
        </DetailsBody>
      </ContentCard>
    </Container>
  );
};

export default PGDetails;
