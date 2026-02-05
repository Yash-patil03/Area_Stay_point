// src/pages/ReviewPage.js
import React from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ReviewForm from '../components/Review/ReviewForm';

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  text-align: center;
  color: white;
  
  h2 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 1.1rem;
    opacity: 0.9;
  }
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 2rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const ReviewPage = () => {
    const { pgId } = useParams();
    const navigate = useNavigate();

    if (!pgId) {
        return <Navigate to="/bookings" />;
    }

    return (
        <PageContainer>
            <BackButton onClick={() => navigate(-1)}>&larr; Back</BackButton>
            <Header>
                <h2>Rate Your Stay</h2>
                <p>Your feedback helps us improve our services.</p>
            </Header>
            <ReviewForm
                pgId={parseInt(pgId)}
                onReviewSubmitted={() => {
                    // Optional: navigate back after success after a short delay
                    setTimeout(() => navigate('/bookings'), 1500);
                }}
            />
        </PageContainer>
    );
};

export default ReviewPage;
