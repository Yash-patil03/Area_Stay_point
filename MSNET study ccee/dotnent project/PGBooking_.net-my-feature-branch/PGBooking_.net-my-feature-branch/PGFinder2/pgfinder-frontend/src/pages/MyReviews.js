import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { reviewAPI } from '../services/api'; // Ensure this matches export

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  animation: ${fadeIn} 0.6s ease-out;
  min-height: 80vh;
`;

const Header = styled.div`
  margin-bottom: 2.5rem;
  text-align: center;

  h1 {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  p {
    color: var(--text-light);
    font-size: 1.1rem;
  }
`;

const ReviewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ReviewCard = styled.div`
  background: var(--surface-color);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--glass-border);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-xl);
    border-color: var(--primary-light);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 0.75rem;
`;

const RatingBadge = styled.div`
  background: ${props => props.rating >= 4 ? '#dcfce7' : props.rating >= 3 ? '#fef9c3' : '#fee2e2'};
  color: ${props => props.rating >= 4 ? '#166534' : props.rating >= 3 ? '#854d0e' : '#991b1b'};
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const PGName = styled.h3`
  font-size: 1.2rem;
  color: var(--text-main);
  margin: 0;
  font-weight: 700;
`;

const Comment = styled.p`
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 0.95rem;
  flex: 1;
  margin-bottom: 1rem;
  font-style: italic;
  background: #f8fafc;
  padding: 1rem;
  border-radius: 12px;
`;

const DateText = styled.span`
  font-size: 0.85rem;
  color: var(--text-light);
  align-self: flex-end;
`;

const BackButton = styled.button`
  background: white;
  color: var(--text-secondary);
  border: 1px solid #e2e8f0;
  padding: 0.6rem 1.2rem;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;
  margin-bottom: 2rem;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #f1f5f9;
    color: var(--primary);
    transform: translateX(-5px);
  }
`;

const MyReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyReviews();
    }, []);

    const fetchMyReviews = async () => {
        try {
            const response = await reviewAPI.getMyReviews();
            setReviews(response.data);
        } catch (error) {
            console.error(error);
            // toast.error('Failed to load your reviews');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <BackButton onClick={() => navigate('/dashboard')}>
                &larr; Back to Dashboard
            </BackButton>

            <Header>
                <h1>My Reviews</h1>
                <p>See what you've shared about your stays.</p>
            </Header>

            {loading ? (
                <div style={{ textAlign: 'center', color: 'var(--text-light)' }}>Loading reviews...</div>
            ) : reviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--surface-color)', borderRadius: '20px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                    <h3 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>No Reviews Yet</h3>
                    <p style={{ color: 'var(--text-light)' }}>You haven't written any reviews yet.</p>
                </div>
            ) : (
                <ReviewsGrid>
                    {reviews.map((review) => (
                        <ReviewCard key={review.reviewId || review.id || Math.random()}>
                            <CardHeader>
                                <PGName>PG #{review.pgId}</PGName> {/* Ideally backend should send PG Name */}
                                <RatingBadge rating={review.rating}>
                                    ⭐ {review.rating}
                                </RatingBadge>
                            </CardHeader>
                            <Comment>"{review.comment}"</Comment>
                            <DateText>
                                {new Date(review.createdAt || Date.now()).toLocaleDateString('en-US', {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                })}
                            </DateText>
                        </ReviewCard>
                    ))}
                </ReviewsGrid>
            )}
        </Container>
    );
};

export default MyReviews;
