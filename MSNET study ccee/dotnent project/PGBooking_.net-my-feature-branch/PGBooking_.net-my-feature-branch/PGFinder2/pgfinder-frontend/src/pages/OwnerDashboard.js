// src/pages/OwnerDashboard.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import styled, { keyframes, css } from 'styled-components';
import { ownerAPI } from '../services/api';
import { useLoadScript } from '@react-google-maps/api';

const libraries = ["places"];

// --- Styled Components & Animations ---

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
  background: #f1f5f9;
  border-radius: 12px;
  padding: 0.5rem;
  gap: 0.5rem;
`;

const Tab = styled.div`
  flex: 1;
  text-align: center;
  padding: 0.75rem;
  font-weight: 600;
  color: ${props => props.active ? '#667eea' : '#a0aec0'};
  background: ${props => props.active ? 'white' : 'transparent'};
  border-radius: 8px;
  box-shadow: ${props => props.active ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'};
  transition: all 0.3s ease;
  font-size: 0.9rem;
`;

const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  animation: ${fadeIn} 0.6s ease-out;
  color: #2d3748;
`;

const Header = styled.div`
  margin-bottom: 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-size: 2.5rem;
    font-weight: 800;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
  }
`;

const PGGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 1rem;
`;

const PropertyCard = styled.div`
  background: var(--surface-color);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.5);

  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-xl);
  }
`;

const CardHeader = styled.div`
  background: var(--gradient-primary);
  padding: 1.5rem;
  color: white;

  h3 {
    margin: 0;
    font-size: 1.4rem;
    font-weight: 700;
    color: white;
  }
  
  .location {
    font-size: 0.9rem;
    opacity: 0.9;
    margin-top: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: white;
  }
`;

const CardBody = styled.div`
  padding: 1.5rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  color: #4a5568;

  strong {
    color: #2d3748;
  }
`;

const CardActions = styled.div`
  padding: 1.25rem 1.5rem;
  background: #f8fafc;
  border-top: 1px solid #edf2f7;
  display: flex;
  gap: 1rem;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  border-radius: 10px;
  border: none;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => {
        switch (props.variant) {
            case 'danger':
                return css`
          background: #ffe4e6;
          color: #be123c;
          &:hover { background: #fecdd3; }
        `;
            case 'warning':
                return css`
          background: #e0f2fe;
          color: #0369a1;
          &:hover { background: #bae6fd; }
        `;
            default: // primary
                return css`
          background: var(--gradient-primary);
          color: white;
          &:hover { opacity: 0.9; transform: translateY(-1px); }
          box-shadow: var(--shadow-glow);
        `;
        }
    }}
`;

const StatsBadge = styled.div`
  background: #f0fff4;
  color: #276749;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  text-align: center;
  margin-top: 1rem;
  border: 1px solid #c6f6d5;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 24px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);

  h3 {
    margin-top: 0;
    margin-bottom: 2rem;
    color: #2d3748;
    font-size: 1.8rem;
    text-align: center;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #4a5568;
    font-weight: 600;
    font-size: 0.9rem;
  }

  input, select, textarea {
    width: 100%;
    padding: 0.85rem;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.2s;
    background: #f8fafc;

    &:focus {
      outline: none;
      border-color: #667eea;
      background: white;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #edf2f7;
`;

const OwnerDashboard = () => {
    const [pgs, setPGs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingPG, setEditingPG] = useState(null);
    const [activeTab, setActiveTab] = useState('details');
    const [pgForm, setPGForm] = useState({
        name: '',
        address: '',
        city: 'Mumbai',
        area: '',
        rent: 0,
        capacity: 0,
        availableSlots: 0,
        genderAllowed: 'Both',
        description: '',
        latitude: 19.0760,
        longitude: 72.8777,
        images: [],
        videos: []
    });
    const [errors, setErrors] = useState({});
    const [videoInput, setVideoInput] = useState('');

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries,
    });

    useEffect(() => {
        loadPGs();
    }, []);

    const loadPGs = async () => {
        setLoading(true);
        try {
            const response = await ownerAPI.getMyPGs();
            setPGs(response.data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to load PGs');
        } finally {
            setLoading(false);
        }
    };

    const handleGeocode = () => {
        if (!isLoaded) {
            toast.error("Google Maps API not loaded yet");
            return;
        }

        const fullAddress = `${pgForm.address}, ${pgForm.area}, ${pgForm.city}`;
        if (!pgForm.address || !pgForm.area) {
            toast.warning("Please fill in Address and Area first");
            return;
        }

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: fullAddress }, (results, status) => {
            if (status === 'OK' && results[0]) {
                const { lat, lng } = results[0].geometry.location;
                setPGForm(prev => ({
                    ...prev,
                    latitude: lat(),
                    longitude: lng()
                }));
                toast.success("Location coordinates updated!");
            } else {
                toast.error("Geocoding failed: " + status);
            }
        });
    };

    const handleAddPG = () => {
        setEditingPG(null);
        setActiveTab('details');
        setPGForm({
            name: '',
            address: '',
            city: 'Mumbai',
            area: '',
            rent: 0,
            capacity: 0,
            availableSlots: 0,
            genderAllowed: 'Both',
            description: '',
            latitude: 19.0760,
            longitude: 72.8777,
            images: [],
            videos: []
        });
        setErrors({});
        setShowModal(true);
    };

    const handleEditPG = (pg) => {
        setEditingPG(pg);
        setActiveTab('details');
        setPGForm({
            name: pg.name,
            address: pg.address,
            city: pg.city,
            area: pg.area,
            rent: pg.rent,
            capacity: pg.capacity,
            availableSlots: pg.availableSlots,
            genderAllowed: pg.genderAllowed,
            description: pg.description,
            latitude: pg.latitude || 19.0760,
            longitude: pg.longitude || 72.8777,
            images: pg.images || [],
            videos: pg.videos || []
        });
        setErrors({});
        setShowModal(true);
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Convert to Base64
        Promise.all(files.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        })).then(base64Images => {
            setPGForm(prev => ({
                ...prev,
                images: [...prev.images, ...base64Images]
            }));
        }).catch(err => toast.error("Error reading files"));
    };

    const removeImage = (index) => {
        setPGForm(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleVideoUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Convert to Base64
        Promise.all(files.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        })).then(base64Videos => {
            setPGForm(prev => ({
                ...prev,
                videos: [...prev.videos, ...base64Videos]
            }));
        }).catch(err => toast.error("Error reading video files"));
    };

    const addVideo = () => {
        if (!videoInput.trim()) return;
        setPGForm(prev => ({
            ...prev,
            videos: [...prev.videos, videoInput.trim()]
        }));
        setVideoInput('');
    };

    const removeVideo = (index) => {
        setPGForm(prev => ({
            ...prev,
            videos: prev.videos.filter((_, i) => i !== index)
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!pgForm.name.trim()) newErrors.name = 'Property Name is required';
        if (!pgForm.area.trim()) newErrors.area = 'Area is required';
        if (!pgForm.address.trim()) newErrors.address = 'Address is required';
        if (!pgForm.rent || Number(pgForm.rent) <= 0) newErrors.rent = 'Rent must be positive';
        if (!pgForm.capacity || Number(pgForm.capacity) <= 0) newErrors.capacity = 'Capacity must be positive';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (activeTab === 'details') setActiveTab('location');
        else if (activeTab === 'location') setActiveTab('media');
        else if (activeTab === 'media') setActiveTab('video');
    };

    const handleBack = () => {
        if (activeTab === 'video') setActiveTab('media');
        else if (activeTab === 'media') setActiveTab('location');
        else if (activeTab === 'location') setActiveTab('details');
    };

    const handleSavePG = async () => {
        if (!validateForm()) {
            toast.error('Please fix validation errors');
            return;
        }

        // Prepare payload
        const payload = {
            ...pgForm,
            // Ensure images/videos are arrays
            images: pgForm.images || [],
            videos: pgForm.videos || [],
            rent: parseFloat(pgForm.rent),
            capacity: parseInt(pgForm.capacity),
            availableSlots: parseInt(pgForm.availableSlots),
            latitude: parseFloat(pgForm.latitude),
            longitude: parseFloat(pgForm.longitude)
        };

        try {
            if (editingPG) {
                await ownerAPI.updatePG(editingPG.pgId, payload);
                toast.success('PG updated successfully');
            } else {
                await ownerAPI.createPG(payload);
                toast.success('PG added successfully');
            }
            setShowModal(false);
            loadPGs();
        } catch (error) {
            console.error("Save Error:", error);
            // Handle varying error formats (string or ValidationProblemDetails object)
            let msg = 'Failed to save PG';
            if (error.response?.data) {
                if (typeof error.response.data === 'string') {
                    msg = error.response.data;
                } else if (error.response.data.errors) {
                    // ASP.NET Core ValidationProblemDetails standard
                    msg = Object.values(error.response.data.errors).flat().join('\n');
                } else if (typeof error.response.data === 'object') {
                    // Basic dictionary or other object
                    msg = Object.values(error.response.data).flat().join('\n');
                }
            }
            toast.error(msg);
        }
    };

    const handleDeletePG = async (id) => {
        if (!window.confirm('Are you sure you want to delete this PG?')) return;

        try {
            await ownerAPI.deletePG(id);
            toast.success('PG deleted successfully');
            loadPGs();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete PG');
        }
    };

    return (
        <DashboardContainer>
            <Header>
                <h2>My Properties</h2>
                <ActionButton onClick={handleAddPG} style={{ maxWidth: '200px' }}>
                    + List New Property
                </ActionButton>
            </Header>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>
                    Loading your properties...
                </div>
            ) : (
                <>
                    {pgs.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            <h3>No Properties Listed Yet</h3>
                            <p style={{ color: '#718096', marginBottom: '2rem' }}>Start earning by listing your PG.</p>
                            <ActionButton onClick={handleAddPG} style={{ maxWidth: '200px', margin: '0 auto' }}>
                                List Your First Property
                            </ActionButton>
                        </div>
                    ) : (
                        <PGGrid>
                            {pgs.map(pg => (
                                <PropertyCard key={pg.pgId}>
                                    <CardHeader>
                                        <h3>{pg.name}</h3>
                                        <div className="location">
                                            📍 {pg.area}, {pg.city}
                                        </div>
                                    </CardHeader>
                                    <CardBody>
                                        <InfoRow>
                                            <span>Rent</span>
                                            <strong>₹{pg.rent.toLocaleString('en-IN')}/mo</strong>
                                        </InfoRow>
                                        <InfoRow>
                                            <span>Capacity</span>
                                            <strong>{pg.capacity} Beds</strong>
                                        </InfoRow>
                                        <InfoRow>
                                            <span>Available</span>
                                            <strong style={{ color: pg.availableSlots > 0 ? '#38a169' : '#e53e3e' }}>
                                                {pg.availableSlots} Beds left
                                            </strong>
                                        </InfoRow>
                                        <InfoRow>
                                            <span>Gender</span>
                                            <strong>{pg.genderAllowed}</strong>
                                        </InfoRow>

                                        <StatsBadge>
                                            {pg.bookingCount} Total Bookings • {pg.activeBookings} Active
                                        </StatsBadge>
                                    </CardBody>
                                    <CardActions>
                                        <ActionButton variant="warning" onClick={() => handleEditPG(pg)}>
                                            Edit Details
                                        </ActionButton>
                                        <ActionButton variant="danger" onClick={() => handleDeletePG(pg.pgId)}>
                                            Remove
                                        </ActionButton>
                                    </CardActions>
                                </PropertyCard>
                            ))}
                        </PGGrid>
                    )}
                </>
            )}

            {/* Add/Edit Modal */}
            {/* Add/Edit Modal */}
            {showModal && (
                <ModalOverlay onClick={() => setShowModal(false)}>
                    <ModalContent onClick={e => e.stopPropagation()}>
                        <div style={{ textAlign: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.8rem', color: '#2b6cb0' }}>
                                {editingPG ? 'Update Property Details' : 'Register Your PG'}
                            </h3>
                            <p style={{ color: '#718096', margin: 0 }}>
                                {editingPG ? 'Modify your existing listing' : 'Fill in the details below to register a new PG into the application.'}
                            </p>
                        </div>

                        <TabContainer>
                            <Tab active={activeTab === 'details'}>1. Details</Tab>
                            <Tab active={activeTab === 'location'}>2. Location</Tab>
                            <Tab active={activeTab === 'media'}>3. Photos</Tab>
                            <Tab active={activeTab === 'video'}>4. Videos</Tab>
                        </TabContainer>

                        <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px' }}>
                            {activeTab === 'details' && (
                                <div style={{ display: 'grid', gap: '1.5rem' }}>
                                    <FormGroup>
                                        <label>Property Name</label>
                                        <input
                                            type="text"
                                            value={pgForm.name}
                                            onChange={(e) => setPGForm({ ...pgForm, name: e.target.value })}
                                            placeholder="e.g. Sai Residency"
                                            style={{ borderColor: errors.name ? '#e53e3e' : '#e2e8f0' }}
                                        />
                                        {errors.name && <small style={{ color: '#e53e3e' }}>{errors.name}</small>}
                                    </FormGroup>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <FormGroup>
                                            <label>Monthly Rent (₹)</label>
                                            <input
                                                type="number"
                                                value={pgForm.rent}
                                                onChange={(e) => setPGForm({ ...pgForm, rent: e.target.value })}
                                                style={{ borderColor: errors.rent ? '#e53e3e' : '#e2e8f0' }}
                                            />
                                        </FormGroup>
                                        <FormGroup>
                                            <label>Total Capacity (Beds)</label>
                                            <input
                                                type="number"
                                                value={pgForm.capacity}
                                                onChange={(e) => setPGForm({ ...pgForm, capacity: e.target.value })}
                                            />
                                        </FormGroup>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <FormGroup>
                                            <label>Available Slots</label>
                                            <input type="number" value={pgForm.availableSlots} onChange={(e) => setPGForm({ ...pgForm, availableSlots: parseInt(e.target.value) })} />
                                        </FormGroup>
                                        <FormGroup>
                                            <label>Preferred Tenants</label>
                                            <select value={pgForm.genderAllowed} onChange={(e) => setPGForm({ ...pgForm, genderAllowed: e.target.value })}>
                                                <option value="Both">Anyone (Co-ed)</option>
                                                <option value="Male">Male Only</option>
                                                <option value="Female">Female Only</option>
                                            </select>
                                        </FormGroup>
                                    </div>

                                    <FormGroup>
                                        <label>Description & Amenities</label>
                                        <textarea rows={4} value={pgForm.description} onChange={(e) => setPGForm({ ...pgForm, description: e.target.value })} placeholder="Describe your PG..." />
                                    </FormGroup>
                                </div>
                            )}

                            {activeTab === 'location' && (
                                <div style={{ display: 'grid', gap: '1.5rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <FormGroup>
                                            <label>City</label>
                                            <input type="text" value={pgForm.city} onChange={(e) => setPGForm({ ...pgForm, city: e.target.value })} />
                                        </FormGroup>
                                        <FormGroup>
                                            <label>Area / Locality</label>
                                            <input
                                                type="text"
                                                value={pgForm.area}
                                                onChange={(e) => setPGForm({ ...pgForm, area: e.target.value })}
                                                style={{ borderColor: errors.area ? '#e53e3e' : '#e2e8f0' }}
                                            />
                                        </FormGroup>
                                    </div>

                                    <FormGroup>
                                        <label>Full Address</label>
                                        <textarea
                                            rows={3}
                                            value={pgForm.address}
                                            onChange={(e) => setPGForm({ ...pgForm, address: e.target.value })}
                                            style={{ borderColor: errors.address ? '#e53e3e' : '#e2e8f0' }}
                                        />
                                    </FormGroup>

                                    <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
                                        <button
                                            type="button"
                                            onClick={handleGeocode}
                                            style={{
                                                background: '#4299e1', color: 'white', border: 'none', borderRadius: '10px',
                                                padding: '0.8rem 2rem', cursor: 'pointer', fontWeight: '600'
                                            }}
                                        >
                                            📍 Auto-Detect Coordinates from Address
                                        </button>
                                    </div>
                                    <div style={{ textAlign: 'center', color: '#718096', fontSize: '0.9rem' }}>
                                        Current Coords: {pgForm.latitude.toFixed(4)}, {pgForm.longitude.toFixed(4)}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'media' && (
                                <div>
                                    <FormGroup>
                                        <label>Upload PG Photos</label>
                                        <div style={{ background: '#f8fafc', padding: '2rem', border: '2px dashed #cbd5e0', borderRadius: '12px', textAlign: 'center' }}>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                style={{ display: 'none' }}
                                                id="image-upload"
                                            />
                                            <label htmlFor="image-upload" style={{ cursor: 'pointer', display: 'block' }}>
                                                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📸</div>
                                                <span style={{ color: '#4299e1', fontWeight: '600' }}>Click to Upload Photos</span>
                                                <p style={{ color: '#a0aec0', fontSize: '0.85rem', marginTop: '0.5rem' }}>Supported formats: JPG, PNG</p>
                                            </label>
                                        </div>
                                    </FormGroup>

                                    <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem' }}>
                                        {pgForm.images.map((img, idx) => (
                                            <div key={idx} style={{ position: 'relative', height: '120px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                                <img src={img} alt="PG" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <button
                                                    onClick={() => removeImage(idx)}
                                                    style={{
                                                        position: 'absolute', top: '5px', right: '5px',
                                                        background: 'rgba(255,0,0,0.8)', color: 'white', border: 'none',
                                                        borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'video' && (
                                <div>
                                    <FormGroup>
                                        <label>Upload Walkthrough Videos</label>
                                        <div style={{ background: '#f8fafc', padding: '2rem', border: '2px dashed #cbd5e0', borderRadius: '12px', textAlign: 'center' }}>
                                            <input
                                                type="file"
                                                multiple
                                                accept="video/*"
                                                onChange={handleVideoUpload}
                                                style={{ display: 'none' }}
                                                id="video-upload"
                                            />
                                            <label htmlFor="video-upload" style={{ cursor: 'pointer', display: 'block' }}>
                                                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎥</div>
                                                <span style={{ color: '#4299e1', fontWeight: '600' }}>Click to Upload Videos</span>
                                                <p style={{ color: '#a0aec0', fontSize: '0.85rem', marginTop: '0.5rem' }}>Showcase your property with a video tour</p>
                                            </label>
                                        </div>
                                    </FormGroup>

                                    <div style={{ marginTop: '1.5rem', display: 'grid', gap: '1rem' }}>
                                        {pgForm.videos.map((vid, idx) => (
                                            <div key={idx} style={{ background: 'white', padding: '1rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ width: '100px', height: '60px', background: '#000', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                                    VIDEO {idx + 1}
                                                </div>
                                                <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    <span style={{ fontSize: '0.9rem', color: '#4a5568' }}>Video uploaded successfully</span>
                                                </div>
                                                <button
                                                    onClick={() => removeVideo(idx)}
                                                    style={{ color: '#e53e3e', border: 'none', background: 'none', cursor: 'pointer', fontWeight: '600' }}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <ButtonGroup>
                            {activeTab === 'details' ? (
                                <ActionButton variant="warning" onClick={() => setShowModal(false)} style={{ background: '#edf2f7', color: '#4a5568' }}>
                                    Cancel
                                </ActionButton>
                            ) : (
                                <ActionButton variant="warning" onClick={handleBack} style={{ background: '#edf2f7', color: '#4a5568' }}>
                                    Back
                                </ActionButton>
                            )}

                            {activeTab !== 'video' ? (
                                <ActionButton onClick={handleNext}>
                                    Next &rarr;
                                </ActionButton>
                            ) : (
                                <ActionButton onClick={handleSavePG}>
                                    {editingPG ? 'Save Changes' : 'Publish Listing'}
                                </ActionButton>
                            )}
                        </ButtonGroup>
                    </ModalContent>
                </ModalOverlay>
            )}
        </DashboardContainer>
    );
};

export default OwnerDashboard;
