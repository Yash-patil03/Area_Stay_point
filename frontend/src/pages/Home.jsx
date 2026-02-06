import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaMapMarkerAlt, FaMoneyBillWave, FaExternalLinkAlt, FaHome } from 'react-icons/fa';

const Home = () => {
    const { user } = useAuth();

    const [pgs, setPgs] = useState([]);
    const [filteredPgs, setFilteredPgs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [filterGender, setFilterGender] = useState('All');
    const [maxPrice, setMaxPrice] = useState('');

    useEffect(() => {
        fetchPGs();
    }, []);

    useEffect(() => {
        filterPGs();
    }, [pgs, searchTerm, filterGender, maxPrice]);

    // ✅ SAFE API FETCH
    const fetchPGs = async () => {
        try {
            const response = await api.get('/pgs');

            // Handle both array & object response
            const pgArray = Array.isArray(response.data)
                ? response.data
                : response.data?.data || [];

            setPgs(pgArray);
            setFilteredPgs(pgArray);
        } catch (error) {
            console.error('Error fetching PGs:', error);
            toast.error('Failed to load PGs');
        } finally {
            setLoading(false);
        }
    };

    // ✅ SAFE FILTER LOGIC
    const filterPGs = () => {
        if (!Array.isArray(pgs)) return;

        let result = [...pgs];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(pg =>
                pg.name?.toLowerCase().includes(term) ||
                pg.address?.toLowerCase().includes(term)
            );
        }

        if (filterGender !== 'All') {
            result = result.filter(pg => pg.gender === filterGender);
        }

        if (maxPrice) {
            result = result.filter(pg => Number(pg.price) <= Number(maxPrice));
        }

        setFilteredPgs(result);
    };

    // ✅ BOOK HANDLER (unchanged logic, safe)
    const handleBook = async (pg) => {
        if (!user) {
            toast.info('Please login to book a PG');
            return;
        }

        try {
            const bookingResponse = await api.post(`/bookings/${pg.id}`);
            const bookingId = bookingResponse.data.id;

            const paymentResponse = await axios.post(
                `/razorpay-service/api/payment/create-order?amount=${pg.price}`
            );

            const orderId = paymentResponse.data;

            const options = {
                key: "rzp_test_RmhKOY4sl1EgCM",
                amount: pg.price * 100,
                currency: "INR",
                name: "Area Stay Point",
                description: `Booking for ${pg.name}`,
                order_id: orderId,
                handler: async function () {
                    await api.put(`/bookings/${bookingId}/status`, { status: "CONFIRMED" });
                    toast.success('Payment Successful! Booking Confirmed.');
                },
                prefill: {
                    name: user.name || "",
                    email: user.email || ""
                },
                theme: { color: "#0f766e" }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', (res) => {
                toast.error(res.error.description);
            });
            rzp.open();

        } catch (error) {
            console.error('Booking failed:', error);
            const errorMsg = error.response && error.response.data
                ? (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data))
                : error.message;
            toast.error('Payment Order Failed: ' + errorMsg);
        }
    };

    return (
        <div className="container">
            <section style={{ marginBottom: '2rem' }}>
                <h2>Available PGs</h2>

                {loading ? (
                    <p>Loading PGs...</p>
                ) : !Array.isArray(filteredPgs) || filteredPgs.length === 0 ? (
                    <p>No PGs match your criteria.</p>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '2rem'
                    }}>
                        {filteredPgs.map((pg) => (
                            <div key={pg.id} className="card">
                                <div style={{ height: 200, background: '#e2e8f0' }}>
                                    {pg.imageUrls?.length ? (
                                        <img
                                            src={pg.imageUrls[0]}
                                            alt={pg.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div style={{
                                            height: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <FaHome size={40} />
                                        </div>
                                    )}
                                </div>

                                <h3>{pg.name}</h3>

                                <p>
                                    <FaMapMarkerAlt /> {pg.address}
                                </p>

                                <p>{pg.description}</p>

                                <p>
                                    <FaMoneyBillWave /> ₹{pg.price} / month
                                </p>

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <Link to={`/pg/${pg.id}`} className="btn btn-outline">
                                        Details
                                    </Link>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleBook(pg)}
                                    >
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
