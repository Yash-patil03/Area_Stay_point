// src/components/Review/ReviewForm.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { reviewAPI } from '../../services/api';
import { validateRating, validateRequired } from '../../utils/validation';

const Container = styled.div`
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 2.5rem;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--glass-border);
  max-width: 500px;
  margin: 2rem auto;
`;

const Title = styled.h3`
  color: var(--text-main);
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
`;

const RatingContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const StarButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: ${props => props.active ? '#ffd700' : '#ddd'};
  transition: color 0.2s ease;
  
  &:hover {
    color: #ffd700;
  }
`;

const TextArea = styled.textarea`
  padding: 1rem;
  border: 2px solid ${props => props.hasError ? 'var(--error)' : '#cbd5e1'};
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  transition: all 0.2s ease;
  background: rgba(255,255,255,0.8);

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? 'var(--error)' : 'var(--primary)'};
    background: white;
    box-shadow: 0 0 0 4px ${props => props.hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(14, 165, 233, 0.1)'};
  }
`;

const ErrorMessage = styled.span`
  color: #ff4757;
  font-size: 0.875rem;
`;

const Button = styled.button`
  background: var(--gradient-primary);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-glow);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(14, 165, 233, 0.4);
    filter: brightness(1.1);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ReviewForm = ({ pgId, onReviewSubmitted }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    comment: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    const ratingError = validateRating(formData.rating.toString());
    if (ratingError) newErrors.rating = ratingError;

    const commentError = validateRequired(formData.comment, 'Comment');
    if (commentError) newErrors.comment = commentError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await reviewAPI.addReview(pgId, formData.rating, formData.comment);
      toast.success('Review submitted successfully!');
      setFormData({ rating: 0, comment: '' });
      onReviewSubmitted?.();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: '' }));
    }
  };

  const handleCommentChange = (e) => {
    setFormData(prev => ({ ...prev, comment: e.target.value }));
    if (errors.comment) {
      setErrors(prev => ({ ...prev, comment: '' }));
    }
  };

  return (
    <Container>
      <Title>Write a Review</Title>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label>Rating</Label>
          <RatingContainer>
            {[1, 2, 3, 4, 5].map((star) => (
              <StarButton
                key={star}
                type="button"
                active={star <= formData.rating}
                onClick={() => handleRatingClick(star)}
              >
                ⭐
              </StarButton>
            ))}
          </RatingContainer>
          {errors.rating && <ErrorMessage>{errors.rating}</ErrorMessage>}
        </InputGroup>

        <InputGroup>
          <Label htmlFor="comment">Comment</Label>
          <TextArea
            id="comment"
            value={formData.comment}
            onChange={handleCommentChange}
            hasError={!!errors.comment}
            placeholder="Share your experience with this PG..."
          />
          {errors.comment && <ErrorMessage>{errors.comment}</ErrorMessage>}
        </InputGroup>

        <Button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Review'}
        </Button>
      </Form>
    </Container>
  );
};

export default ReviewForm;
