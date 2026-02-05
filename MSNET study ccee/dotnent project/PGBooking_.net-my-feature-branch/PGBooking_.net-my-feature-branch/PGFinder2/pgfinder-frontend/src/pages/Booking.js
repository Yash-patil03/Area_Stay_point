// src/pages/Booking.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { toast } from 'react-toastify';
import { bookingAPI, paymentAPI, discountAPI } from '../services/api';

const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Helper to format dates, handling .NET default dates (0001-01-01)
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    // Check for invalid date or year 1 (0001)
    if (isNaN(date.getTime()) || date.getFullYear() <= 1) {
        return 'Pending'; // or 'N/A' or appropriate fallback
    }
    return date.toLocaleDateString();
};

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  color: #333;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: var(--text-main);
  margin: 0;
  font-weight: 800;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const BackButton = styled.button`
  background: white;
  color: var(--text-secondary);
  border: 1px solid #e2e8f0;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    background: #f1f5f9;
    color: var(--text-main);
  }
`;

const ContentCard = styled.div`
  background: var(--surface-color);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-xl);
  margin-bottom: 2rem;
  border: 1px solid rgba(255,255,255,0.5);
`;

const CardHeader = styled.div`
  background: ${props => props.status === 'Confirmed' ? '#48bb78' : props.status === 'Cancelled' ? '#f56565' : '#ed8936'};
  padding: 1.5rem 2rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatusBadge = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.9rem;
`;

const CardBody = styled.div`
  padding: 2rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  color: #718096;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.75rem;
  margin-bottom: 1rem;
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

const ActionButton = styled.button`
  width: 100%;
  padding: 1rem;
  border-radius: 12px;
  background: var(--gradient-primary);
  color: white;
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: transform 0.2s;
  box-shadow: var(--shadow-glow);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-xl);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

// --- Modal & Receipt Styled Components ---
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 25px 50px rgba(0,0,0,0.25);
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 { margin: 0; font-size: 1.5rem; color: #2d3748; }
  button { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #a0aec0; }
`;

const PaymentOptions = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const OptionButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  border-radius: 10px;
  border: 2px solid ${props => props.active ? '#667eea' : '#e2e8f0'};
  background: ${props => props.active ? '#ebf4ff' : 'white'};
  color: ${props => props.active ? '#5a67d8' : '#718096'};
  font-weight: 600;
  cursor: pointer;
  
  &:hover { border-color: #667eea; }
`;

const FormField = styled.div`
  margin-bottom: 1rem;
  
  label { display: block; margin-bottom: 0.5rem; color: #4a5568; font-size: 0.9rem; font-weight: 500; }
  input { width: 100%; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 1rem; transition: border-color 0.2s; }
  input:focus { outline: none; border-color: #667eea; }
  .error { color: #e53e3e; font-size: 0.85rem; margin-top: 0.25rem; }
`;

const QRCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 12px;
  margin-bottom: 1rem;
  
  .qr-placeholder {
    width: 200px;
    height: 200px;
    background: white;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px dashed #cbd5e0;
    color: #718096;
    font-weight: 500;
  }
`;

const PriceDisplay = styled.div`
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  padding-top: 1rem;
  border-top: 1px dashed #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  
  .label { font-size: 0.9rem; color: #718096; }
  .amount { font-size: 1.8rem; font-weight: 700; color: #2d3748; }
`;

// --- Receipt Styles ---
const ReceiptContainer = styled.div`
  border: 2px dashed #cbd5e0;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  text-align: center;
`;

const ReceiptHeader = styled.div`
  margin-bottom: 2rem;
  h3 { color: #2d3748; margin: 0; font-size: 1.5rem; }
  p { color: #718096; font-size: 0.9rem; margin-top: 0.5rem; }
`;

const CheckIcon = styled.div`
  width: 60px;
  height: 60px;
  background: #c6f6d5;
  color: #276749;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1rem;
`;

const ReceiptRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #edf2f7;
  
  span:first-child { color: #718096; font-size: 0.95rem; }
  span:last-child { color: #2d3748; font-weight: 600; }
  
  &:last-child { border-bottom: none; }
`;

const PrintButton = styled.button`
  background: #4a5568;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  margin-top: 1.5rem;
  cursor: pointer;
  font-weight: 500;
  
  &:hover { background: #2d3748; }
`;

const Booking = () => {
    const { pgId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [processing, setProcessing] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        cardNumber: '',
        expiry: '',
        cvv: '',
        holderName: ''
    });
    const [errors, setErrors] = useState({});

    // Discount State
    const [showDiscountModal, setShowDiscountModal] = useState(false);
    const [discountPercent, setDiscountPercent] = useState('');

    const handleDiscountRequest = async (e) => {
        e.preventDefault();
        try {
            await discountAPI.requestDiscount({
                userId: booking.userId,
                pgId: booking.pgId,
                pgName: booking.pgName, // Optional if backend needs it
                reason: "Financial Aid Requested",
                discountPercent: 0, // 0 indicates donor decides
                status: "Pending"
            });
            toast.success('Scholarship request submitted! Waiting for Donor approval.');
            setShowDiscountModal(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to submit request');
        }
    };

    useEffect(() => {
        if (pgId) {
            loadBookingDetails(parseInt(pgId));
        }
    }, [pgId]);

    const loadBookingDetails = async (id) => {
        try {
            const response = await bookingAPI.getBooking(id);
            setBooking(response.data);
        } catch (error) {
            toast.error('Failed to load booking details');
            navigate('/bookings');
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        if (paymentMethod === 'upi') return true; // Simulate UPI validation always true for now

        const newErrors = {};
        if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
            newErrors.cardNumber = 'Card number must be 16 digits';
        }
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiry)) {
            newErrors.expiry = 'Format MM/YY required';
        }
        if (!/^\d{3,4}$/.test(formData.cvv)) {
            newErrors.cvv = 'Invalid CVV';
        }
        if (!formData.holderName.trim()) {
            newErrors.holderName = 'Cardholder name is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error on change
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handlePayment = async (e) => {
        if (e) e.preventDefault();
        if (!booking) return;

        // If generic/manual method allowed, keep it. But for Razorpay:
        if (paymentMethod === 'card') {
            try {
                setProcessing(true);
                // 1. Create Order on Backend
                const orderResponse = await paymentAPI.createOrder(booking.bookingId);
                const { orderId, keyId, amount, currency, name, description } = orderResponse.data;

                const options = {
                    key: keyId, // Key from backend
                    amount: amount,
                    currency: currency,
                    name: name,
                    description: description,
                    order_id: orderId, // Order ID from backend
                    image: "https://cdn-icons-png.flaticon.com/512/2175/2175515.png",
                    handler: async function (response) {
                        try {
                            // 2. Verify Payment on Backend
                            await paymentAPI.verifyPayment({
                                bookingId: booking.bookingId,
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpayOrderId: response.razorpay_order_id,
                                razorpaySignature: response.razorpay_signature
                            });

                            toast.success('Payment Successful! Bill Generated.');
                            setShowPaymentModal(false);
                            setShowReceipt(true);
                            loadBookingDetails(booking.bookingId);
                        } catch (error) {
                            console.error(error);
                            toast.error('Payment verification failed');
                        }
                    },
                    prefill: {
                        name: booking.userName || "User", // Ideally fetch from user context
                        email: booking.userEmail || "user@example.com",
                        contact: booking.userPhone || "9999999999"
                    },
                    theme: {
                        color: "#667eea"
                    }
                };

                const rzp1 = new window.Razorpay(options);
                rzp1.on('payment.failed', function (response) {
                    toast.error(response.error.description);
                });
                rzp1.open();
                setProcessing(false); // Stop processing spinner so user can interact with popup
            } catch (error) {
                console.error("Order creation failed", error);
                toast.error("Failed to initiate payment. Please check backend configuration.");
                setProcessing(false);
            }
        } else {
            // Existing logic for other methods (like UPI simulation)
            setProcessing(true);
            // Simulate processing delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            try {
                await paymentAPI.makePayment(booking.bookingId);
                toast.success('Payment Successful! Bill Generated.');
                setShowPaymentModal(false);
                setShowReceipt(true);
                loadBookingDetails(booking.bookingId);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Payment failed');
            } finally {
                setProcessing(false);
            }
        }
    };

    // Fix: Fallback to 'rent' if totalAmount/finalAmount is 0 or missing
    const currentPrice = booking ? (booking.finalAmount || booking.totalAmount || booking.rent || 0) : 0;

    if (loading) return <Container><h2 style={{ color: 'white', textAlign: 'center' }}>Loading...</h2></Container>;

    if (!booking) return <Container><h2 style={{ color: 'white', textAlign: 'center' }}>Booking Not Found</h2></Container>;

    return (
        <Container>
            <Header>
                <Title>Booking Details</Title>
                <BackButton onClick={() => navigate('/bookings')}>&larr; Back to My Bookings</BackButton>
            </Header>

            <ContentCard>
                <CardHeader status={booking.status}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>#{booking.bookingId}</div>
                    <StatusBadge>{booking.status}</StatusBadge>
                </CardHeader>

                <CardBody>
                    <Section>
                        <SectionTitle>Property Details</SectionTitle>
                        <InfoGrid>
                            <InfoItem>
                                <div className="label">Property Name</div>
                                <div className="value">{booking.pgName}</div>
                            </InfoItem>
                            <InfoItem>
                                <div className="label">Location</div>
                                <div className="value">{booking.pgCity}, {booking.pgAddress}</div>
                            </InfoItem>
                        </InfoGrid>
                    </Section>

                    <Section>
                        <SectionTitle>Booking Information</SectionTitle>
                        <InfoGrid>
                            <InfoItem>
                                <div className="label">Booking Date</div>
                                <div className="value">{formatDate(booking.bookingDate)}</div>
                            </InfoItem>
                            <InfoItem>
                                <div className="label">Check-in</div>
                                <div className="value">{formatDate(booking.checkInDate)}</div>
                            </InfoItem>
                        </InfoGrid>
                    </Section>

                    <Section>
                        <SectionTitle>Payment Summary</SectionTitle>
                        <InfoGrid>
                            <InfoItem>
                                <div className="label">Rent Amount</div>
                                <div className="value">₹{booking.totalAmount?.toLocaleString() || booking.rent?.toLocaleString()}</div>
                            </InfoItem>
                            <InfoItem>
                                <div className="label">Discount</div>
                                <div className="value" style={{ color: '#38a169' }}>-₹{booking.discountAmount?.toLocaleString() || 0}</div>
                            </InfoItem>
                            <InfoItem>
                                <div className="label">Total Payable</div>
                                <div className="value" style={{ fontSize: '1.5rem', color: '#667eea' }}>
                                    ₹{currentPrice.toLocaleString()}
                                </div>
                            </InfoItem>
                        </InfoGrid>

                        {booking.status === 'Pending' && (
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <ActionButton style={{ marginTop: 0 }} onClick={() => setShowPaymentModal(true)}>
                                    Proceed to Payment
                                </ActionButton>
                                <ActionButton
                                    style={{ marginTop: 0, background: '#ecc94b', color: '#000' }}
                                    onClick={() => setShowDiscountModal(true)}
                                >
                                    Request Scholarship
                                </ActionButton>
                            </div>
                        )}
                        {/* If Confirmed, link to view bill? */}
                        {booking.status === 'Confirmed' && !showReceipt && (
                            <ActionButton onClick={() => setShowReceipt(true)} style={{ background: '#48bb78' }}>
                                View Receipt / Bill
                            </ActionButton>
                        )}
                    </Section>
                </CardBody>
            </ContentCard>

            {/* Payment Modal */}
            {showPaymentModal && (
                <ModalOverlay>
                    <ModalContent>
                        <ModalHeader>
                            <h2>Secure Payment</h2>
                            <button onClick={() => setShowPaymentModal(false)}>&times;</button>
                        </ModalHeader>

                        <PaymentOptions>
                            <OptionButton active={paymentMethod === 'card'} onClick={() => setPaymentMethod('card')}>
                                💳 Card
                            </OptionButton>
                            <OptionButton active={paymentMethod === 'upi'} onClick={() => setPaymentMethod('upi')}>
                                📱 UPI / QR
                            </OptionButton>
                        </PaymentOptions>

                        <form onSubmit={handlePayment}>
                            {paymentMethod === 'card' ? (
                                <>
                                    <div style={{ padding: '2rem', textAlign: 'center', color: '#4a5568' }}>
                                        <p>Click the button below to pay securely via Razorpay.</p>
                                        <p style={{ fontSize: '0.9rem', color: '#718096' }}>Supports Cards, Netbanking, UPI, and Wallets.</p>
                                    </div>
                                </>
                            ) : (
                                <QRCodeContainer>
                                    <div className="qr-placeholder" style={{
                                        background: `url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=pgfinder@upi&pn=PGFinder&am=${currentPrice}&cu=INR') center no-repeat`,
                                        backgroundSize: 'contain'
                                    }}></div>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#4a5568' }}>Scan with any UPI App to Pay</p>
                                </QRCodeContainer>
                            )}

                            <PriceDisplay>
                                <span className="label">Total Amount</span>
                                <span className="amount">₹{currentPrice.toLocaleString()}</span>
                            </PriceDisplay>

                            <ActionButton type="submit" disabled={processing} style={{ marginTop: 0 }}>
                                {processing ? 'Verifying Details...' : `Pay ₹${currentPrice.toLocaleString()}`}
                            </ActionButton>
                        </form>
                    </ModalContent>
                </ModalOverlay>
            )}

            {/* Request Scholarship Modal */}
            {showDiscountModal && (
                <ModalOverlay>
                    <ModalContent>
                        <ModalHeader>
                            <h2>Request Scholarship / Financial Aid</h2>
                            <button onClick={() => setShowDiscountModal(false)}>&times;</button>
                        </ModalHeader>
                        <form onSubmit={handleDiscountRequest}>
                            <p style={{ color: '#4a5568', marginBottom: '1.5rem', background: '#fffaf0', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid #fbd38d' }}>
                                Your request will be sent to our Donor community. A donor can choose to approve your request and decide the scholarship amount/percentage. You will be notified upon approval.
                            </p>
                            <ActionButton type="submit" style={{ background: '#ecc94b', color: 'black' }}>
                                Submit Request
                            </ActionButton>
                        </form>
                    </ModalContent>
                </ModalOverlay>
            )}

            {/* Receipt/Bill Modal */}
            {showReceipt && (
                <ModalOverlay>
                    <ModalContent>
                        <ReceiptContainer id="printable-receipt" style={{ textAlign: 'left', padding: '2.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem' }}>
                                <div>
                                    <h2 style={{ color: '#667eea', fontWeight: '800', margin: 0 }}>INVOICE</h2>
                                    <p style={{ color: '#718096', margin: '0.2rem 0' }}>Booking #{booking.bookingId}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <h4 style={{ margin: 0, color: '#2d3748' }}>PGFinder</h4>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#718096' }}>Date: {new Date().toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <p style={{ fontSize: '0.85rem', color: '#718096', fontWeight: 'bold', textTransform: 'uppercase' }}>Billed To</p>
                                    <h4 style={{ margin: '0.2rem 0', color: '#2d3748' }}>{booking.userName || 'Student'}</h4>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#4a5568' }}>{booking.userEmail}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '0.85rem', color: '#718096', fontWeight: 'bold', textTransform: 'uppercase' }}>Property</p>
                                    <h4 style={{ margin: '0.2rem 0', color: '#2d3748' }}>{booking.pgName}</h4>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#4a5568' }}>{booking.pgCity}</p>
                                </div>
                            </div>

                            <table style={{ width: '100%', marginBottom: '2rem', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f7fafc', borderBottom: '2px solid #edf2f7' }}>
                                        <th style={{ padding: '0.75rem', textAlign: 'left', color: '#4a5568', fontSize: '0.9rem' }}>Description</th>
                                        <th style={{ padding: '0.75rem', textAlign: 'right', color: '#4a5568', fontSize: '0.9rem' }}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{ borderBottom: '1px solid #edf2f7' }}>
                                        <td style={{ padding: '0.75rem', color: '#2d3748' }}>Monthly Rent</td>
                                        <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '500' }}>₹{booking.totalAmount?.toLocaleString()}</td>
                                    </tr>
                                    {booking.discountAmount > 0 && (
                                        <tr style={{ borderBottom: '1px solid #edf2f7' }}>
                                            <td style={{ padding: '0.75rem', color: '#38a169' }}>Scholarship Discount</td>
                                            <td style={{ padding: '0.75rem', textAlign: 'right', color: '#38a169' }}>-₹{booking.discountAmount?.toLocaleString()}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <div style={{ width: '250px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '1.2rem', color: '#2d3748' }}>
                                        <span>Total Paid:</span>
                                        <span>₹{currentPrice.toLocaleString()}</span>
                                    </div>
                                    <p style={{ textAlign: 'right', fontSize: '0.85rem', color: '#718096', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem' }}>
                                        Paid via {paymentMethod === 'card' ? 'Online Mode' : 'UPI/QR'}
                                    </p>
                                </div>
                            </div>
                        </ReceiptContainer>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <PrintButton onClick={() => window.print()} style={{ flex: 1, background: '#2d3748' }}>
                                Print Bill
                            </PrintButton>
                            <PrintButton onClick={() => setShowReceipt(false)} style={{ flex: 1, background: '#edf2f7', color: '#2d3748' }}>
                                Close
                            </PrintButton>
                        </div>
                    </ModalContent>
                </ModalOverlay>
            )}
        </Container>
    );
};

export default Booking;
