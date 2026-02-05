// src/components/Booking/BookingList.js
import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { bookingAPI, paymentAPI } from '../../services/api';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  text-align: center;
  color: var(--text-main);
  margin-bottom: 3rem;
  font-size: 2.5rem;
  font-weight: 800;
`;

const BookingGrid = styled.div`
  display: grid;
  gap: 2rem;
`;

const BookingCard = styled.div`
  background: var(--surface-color);
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  border: 1px solid rgba(0,0,0,0.05);
  transition: transform 0.2s;
  
  &:hover {
    box-shadow: var(--shadow-lg);
    border-color: var(--primary);
  }
`;

const BookingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const BookingId = styled.h3`
  color: #333;
  margin: 0;
`;

const BookingStatus = styled.span`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  background: ${props => {
        switch (props.status.toLowerCase()) {
            case 'confirmed': return '#d4edda';
            case 'pending': return '#fff3cd';
            case 'cancelled': return '#f8d7da';
            default: return '#e2e3e5';
        }
    }};
  color: ${props => {
        switch (props.status.toLowerCase()) {
            case 'confirmed': return '#155724';
            case 'pending': return '#856404';
            case 'cancelled': return '#721c24';
            default: return '#383d41';
        }
    }};
`;

const BookingDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DetailLabel = styled.span`
  font-size: 0.875rem;
  color: #666;
  font-weight: 500;
`;

const DetailValue = styled.span`
  color: #333;
  font-weight: 500;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s ease;
  
  background: ${props => {
        switch (props.variant) {
            case 'primary': return 'var(--primary)';
            case 'danger': return 'var(--accent)';
            default: return '#f1f5f9';
        }
    }};
  
  color: ${props => props.variant === 'secondary' ? 'var(--text-main)' : 'white'};
  
  &:hover {
    transform: translateY(-2px);
    background: ${props => {
        switch (props.variant) {
            case 'primary': return 'var(--primary-dark)';
            default: return '#e2e8f0';
        }
    }};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: var(--text-light);
  padding: 3rem;
  background: var(--surface-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const EmptyDescription = styled.p`
  font-size: 1.1rem;
  opacity: 0.8;
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const SearchInput = styled.input`
  padding: 0.8rem 1.2rem;
  border-radius: 50px;
  border: 1px solid #e2e8f0;
  width: 100%;
  max-width: 300px;
  font-size: 1rem;
  background: white;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
  }
`;

const SortSelect = styled.select`
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  border: 1px solid #e2e8f0;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  
  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const BookingList = () => {
    const { isAuthenticated } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({});

    // Search & Sort State
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('date-desc');

    useEffect(() => {
        fetchBookings();
    }, []);

    useEffect(() => {
        let result = [...bookings];

        // Filter
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(b =>
                b.bookingId.toString().includes(lowerTerm) ||
                b.status.toLowerCase().includes(lowerTerm) ||
                (b.pgName && b.pgName.toLowerCase().includes(lowerTerm))
            );
        }

        // Sort
        result.sort((a, b) => {
            switch (sortBy) {
                case 'date-desc':
                    return new Date(b.bookingDate) - new Date(a.bookingDate);
                case 'date-asc':
                    return new Date(a.bookingDate) - new Date(b.bookingDate);
                case 'amount-desc':
                    return (b.totalAmount || 0) - (a.totalAmount || 0);
                case 'amount-asc':
                    return (a.totalAmount || 0) - (b.totalAmount || 0);
                case 'status':
                    return a.status.localeCompare(b.status);
                default:
                    return 0;
            }
        });

        setFilteredBookings(result);
    }, [bookings, searchTerm, sortBy]);

    const fetchBookings = async () => {
        try {
            const response = await bookingAPI.getMyBookings();
            setBookings(response.data);
            setFilteredBookings(response.data);
        } catch (error) {
            toast.error('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async (bookingId) => {
        setActionLoading(prev => ({ ...prev, [bookingId]: 'payment' }));
        try {
            await paymentAPI.makePayment(bookingId);
            toast.success('Payment successful!');
            fetchBookings(); // Refresh bookings
        } catch (error) {
            toast.error(error.response?.data?.message || 'Payment failed');
        } finally {
            setActionLoading(prev => ({ ...prev, [bookingId]: '' }));
        }
    };

    if (!isAuthenticated) return <Navigate to="/login" />;

    if (loading) return <Container><Title>Loading your bookings...</Title></Container>;

    return (
        <Container>
            <Title>My Bookings</Title>

            <SearchContainer>
                <SearchInput
                    placeholder="Search by ID, Status, or PG..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <SortSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="date-desc">Newest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="amount-desc">Amount: High to Low</option>
                    <option value="amount-asc">Amount: Low to High</option>
                    <option value="status">Status</option>
                </SortSelect>
            </SearchContainer>

            {filteredBookings.length === 0 ? (
                <EmptyState>
                    <EmptyIcon>📋</EmptyIcon>
                    <EmptyTitle>No Bookings Found</EmptyTitle>
                    <EmptyDescription>
                        {bookings.length === 0
                            ? "You haven't made any bookings yet."
                            : "No bookings match your search criteria."}
                    </EmptyDescription>
                    {bookings.length > 0 && (
                        <Button
                            variant="secondary"
                            onClick={() => setSearchTerm('')}
                            style={{ marginTop: '1rem' }}
                        >
                            Clear Search
                        </Button>
                    )}
                </EmptyState>
            ) : (
                <BookingGrid>
                    {filteredBookings.map((booking) => (
                        <BookingCard key={booking.bookingId}>
                            <BookingHeader>
                                <BookingId>Booking #{booking.bookingId}</BookingId>
                                <BookingStatus status={booking.status}>{booking.status}</BookingStatus>
                            </BookingHeader>

                            <BookingDetails>
                                <DetailItem>
                                    <DetailLabel>PG ID</DetailLabel>
                                    <DetailValue>#{booking.pgId}</DetailValue>
                                </DetailItem>

                                <DetailItem>
                                    <DetailLabel>Booking Date</DetailLabel>
                                    <DetailValue>
                                        {new Date(booking.bookingDate).toLocaleDateString()}
                                    </DetailValue>
                                </DetailItem>

                                <DetailItem>
                                    <DetailLabel>Discount Applied</DetailLabel>
                                    <DetailValue>₹{(booking.discountAmount || 0).toLocaleString()}</DetailValue>
                                </DetailItem>

                                <DetailItem>
                                    <DetailLabel>Status</DetailLabel>
                                    <DetailValue>{booking.status}</DetailValue>
                                </DetailItem>
                            </BookingDetails>

                            <ActionButtons>
                                {booking.status === 'Pending' && (
                                    <Button
                                        variant="primary"
                                        onClick={() => handlePayment(booking.bookingId)}
                                        disabled={actionLoading[booking.bookingId] === 'payment'}
                                    >
                                        {actionLoading[booking.bookingId] === 'payment' ? 'Processing...' : 'Make Payment'}
                                    </Button>
                                )}

                                <Button variant="secondary" as={Link} to={`/booking/${booking.bookingId}`} style={{ textDecoration: 'none' }}>
                                    View Details
                                </Button>

                                {booking.status === 'Confirmed' && (
                                    <Button
                                        variant="secondary"
                                        as={Link}
                                        to={`/reviews/${booking.pgId}`}
                                        style={{ textDecoration: 'none' }}
                                    >
                                        Add Review
                                    </Button>
                                )}
                            </ActionButtons>
                        </BookingCard>
                    ))}
                </BookingGrid>
            )}
        </Container>
    );
};

export default BookingList;
