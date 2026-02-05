// src/pages/Payment.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { bookingAPI, paymentAPI, pgAPI } from '../services/api';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const ContentCard = styled.div`
  background: var(--surface-color);
  padding: 3rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  border: 1px solid rgba(0,0,0,0.05);
`;

const Title = styled.h1`
  color: var(--text-main);
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 800;
`;

const SummaryTable = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 2rem;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  font-size: 1.1rem;

  &:last-child {
    border-bottom: none;
    background: #f8fafc;
    font-weight: 700;
    font-size: 1.25rem;
    color: var(--primary);
  }
`;

const Label = styled.span`
  color: var(--text-light);
`;

const Value = styled.span`
  color: var(--text-main);
  font-weight: 600;
`;

const PaymentButton = styled.button`
  width: 100%;
  padding: 1.2rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  opacity: ${props => props.disabled ? 0.7 : 1};
  box-shadow: var(--shadow-md);

  &:hover {
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
    background: var(--primary-dark);
    box-shadow: var(--shadow-lg);
  }
`;

const Payment = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(!booking);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    if (!booking && bookingId) {
      loadBooking();
    }
  }, [bookingId, booking]);

  const loadBooking = async () => {
    try {
      const response = await bookingAPI.getBooking(bookingId);
      let data = response.data;

      // Fallback: If price is 0 (old booking), fetch from PG details
      if (!data.amount || data.amount <= 0) {
        try {
          const pgResponse = await pgAPI.getPG(data.pgId);
          if (pgResponse.data && pgResponse.data.rent) {
            data.rent = pgResponse.data.rent;
            data.amount = pgResponse.data.rent;
            data.finalAmount = pgResponse.data.rent;
          }
        } catch (err) {
          console.error("Failed to fetch PG fallback price", err);
        }
      }
      setBooking(data);
    } catch (error) {
      toast.error('Failed to load booking details');
      navigate('/bookings');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setPaymentLoading(true);
    try {
      // 1. Create Order from Backend
      const response = await paymentAPI.createOrder(bookingId);
      const { orderId, keyId, amount, currency, name, description } = response.data;

      // 2. Configure Razorpay Options
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: name,
        description: description,
        order_id: orderId,
        handler: async function (response) {
          // 3. Verify Payment on Backend
          try {
            const verifyData = {
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              bookingId: parseInt(bookingId)
            };

            await paymentAPI.verifyPayment(verifyData);
            toast.success('Payment Successful! Booking Confirmed.');
            navigate('/bookings');
          } catch (error) {
            console.error(error);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: "PGFinder User",
          email: "user@pgfinder.com",
          contact: "9999999999"
        },
        theme: {
          color: "#667eea"
        }
      };

      // 4. Open Checkout
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        toast.error(response.error.description || "Payment Failed");
      });
      rzp.open();

    } catch (error) {
      console.error("Payment Error:", error);
      toast.error(error.response?.data || 'Failed to initiate payment');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) return <Container><h2 style={{ color: 'var(--text-main)', textAlign: 'center' }}>Loading...</h2></Container>;
  if (!booking) return <Container><h2 style={{ color: 'var(--text-main)', textAlign: 'center' }}>Booking Not Found</h2></Container>;

  // Ensure we have numbers
  const rent = parseFloat(booking.rent || booking.amount) || 0;
  const finalAmount = parseFloat(booking.amount || booking.finalAmount) || rent;

  return (
    <Container>
      <ContentCard>
        <Title>Complete Payment</Title>

        {/* Booking ID removed */}

        <SummaryTable>
          <Row>
            <Label>PG Rent</Label>
            <Value>₹{rent.toLocaleString()}</Value>
          </Row>

          <Row>
            <Label>Total Payable</Label>
            <Value>₹{finalAmount.toLocaleString()}</Value>
          </Row>
        </SummaryTable>

        <PaymentButton onClick={handlePayment} disabled={paymentLoading}>
          {paymentLoading ? 'Processing...' : `Pay ₹${finalAmount.toLocaleString()}`}
        </PaymentButton>
      </ContentCard>
    </Container>
  );
};

export default Payment;
