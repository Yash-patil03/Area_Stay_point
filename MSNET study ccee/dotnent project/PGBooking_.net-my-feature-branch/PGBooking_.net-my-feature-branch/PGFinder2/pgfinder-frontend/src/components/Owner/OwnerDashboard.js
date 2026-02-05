// src/components/Owner/OwnerDashboard.js
import React, { useState, useEffect } from 'react';
import { ownerAPI } from '../../services/api';
import { toast } from 'react-toastify';
import styled from 'styled-components';

const OwnerContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 2px solid #ddd;
`;

const Tab = styled.button`
  padding: 10px 20px;
  border: none;
  background: ${props => props.active ? '#007bff' : 'transparent'};
  color: ${props => props.active ? 'white' : '#007bff'};
  cursor: pointer;
  border-bottom: 2px solid ${props => props.active ? '#007bff' : 'transparent'};
`;

const Form = styled.form`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  rows: 4;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  
  &.primary { background: #007bff; color: white; }
  &.success { background: #28a745; color: white; }
  &.danger { background: #dc3545; color: white; }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  th {
    background-color: #f8f9fa;
    font-weight: bold;
  }
`;

const OwnerDashboard = () => {
    const [activeTab, setActiveTab] = useState('my-pgs');
    const [pgs, setPgs] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingPG, setEditingPG] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        price: '',
        amenities: '',
        contactNumber: '',
        contactNumber: '',
        images: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadMyPGs();
    }, []);

    const loadMyPGs = async () => {
        try {
            const response = await ownerAPI.getMyPGs();
            setPgs(response.data);
        } catch (error) {
            toast.error('Failed to load PGs');
        }
    };

    const loadBookings = async (pgId) => {
        try {
            const response = await ownerAPI.getPGBookings(pgId);
            setBookings(response.data);
        } catch (error) {
            toast.error('Failed to load bookings');
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'PG Name is required';
        if (!formData.location.trim()) newErrors.location = 'Location is required';
        if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Price must be a positive number';
        if (!formData.contactNumber.trim() || !/^\d{10}$/.test(formData.contactNumber)) {
            newErrors.contactNumber = 'Contact number must be valid 10 digits';
        }
        if (formData.images && formData.images.trim()) {
            const urls = formData.images.split(',').map(u => u.trim());
            const invalidUrl = urls.find(u => !u.match(/^https?:\/\/.+/));
            if (invalidUrl) {
                newErrors.images = `Invalid URL found: ${invalidUrl}`;
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix validation errors');
            return;
        }

        // Convert comma-separated images string to array
        const payload = {
            ...formData,
            images: formData.images ? formData.images.split(',').map(url => url.trim()).filter(url => url.length > 0) : []
        };

        try {
            if (editingPG) {
                await ownerAPI.updatePG(editingPG.id, payload);
                toast.success('PG updated successfully');
            } else {
                await ownerAPI.createPG(payload);
                toast.success('PG added successfully');
            }
            setShowAddForm(false);
            setEditingPG(null);
            setErrors({});
            setFormData({
                name: '',
                description: '',
                location: '',
                price: '',
                amenities: '',
                contactNumber: '',
                images: ''
            });
            loadMyPGs();
        } catch (error) {
            console.error(error);
            toast.error('Failed to save PG');
        }
    };

    const handleEdit = (pg) => {
        setEditingPG(pg);
        setFormData({
            name: pg.name,
            description: pg.description,
            location: pg.location,
            price: pg.price.toString(),
            amenities: pg.amenities,
            contactNumber: pg.contactNumber,
            images: pg.images
        });
        setShowAddForm(true);
        setErrors({});
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this PG?')) {
            try {
                await ownerAPI.deletePG(id);
                toast.success('PG deleted successfully');
                loadMyPGs();
            } catch (error) {
                toast.error('Failed to delete PG');
            }
        }
    };

    const renderPGForm = () => (
        <Form onSubmit={handleSubmit}>
            <h3>{editingPG ? 'Edit PG' : 'Add New PG'}</h3>
            <FormGroup>
                <Label>PG Name</Label>
                <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: null });
                    }}
                    required
                    style={{ borderColor: errors.name ? 'red' : '#ddd' }}
                />
                {errors.name && <small style={{ color: 'red' }}>{errors.name}</small>}
            </FormGroup>
            <FormGroup>
                <Label>Description</Label>
                <TextArea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                />
            </FormGroup>
            <FormGroup>
                <Label>Location</Label>
                <Input
                    type="text"
                    value={formData.location}
                    onChange={(e) => {
                        setFormData({ ...formData, location: e.target.value });
                        if (errors.location) setErrors({ ...errors, location: null });
                    }}
                    required
                    style={{ borderColor: errors.location ? 'red' : '#ddd' }}
                />
                {errors.location && <small style={{ color: 'red' }}>{errors.location}</small>}
            </FormGroup>
            <FormGroup>
                <Label>Price (per month)</Label>
                <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => {
                        setFormData({ ...formData, price: e.target.value });
                        if (errors.price) setErrors({ ...errors, price: null });
                    }}
                    required
                    style={{ borderColor: errors.price ? 'red' : '#ddd' }}
                />
                {errors.price && <small style={{ color: 'red' }}>{errors.price}</small>}
            </FormGroup>
            <FormGroup>
                <Label>Amenities</Label>
                <Input
                    type="text"
                    value={formData.amenities}
                    onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                    placeholder="WiFi, AC, Meals, etc."
                />
            </FormGroup>
            <FormGroup>
                <Label>Contact Number</Label>
                <Input
                    type="tel"
                    value={formData.contactNumber}
                    onChange={(e) => {
                        setFormData({ ...formData, contactNumber: e.target.value });
                        if (errors.contactNumber) setErrors({ ...errors, contactNumber: null });
                    }}
                    required
                    maxLength={10}
                    style={{ borderColor: errors.contactNumber ? 'red' : '#ddd' }}
                />
                {errors.contactNumber && <small style={{ color: 'red' }}>{errors.contactNumber}</small>}
            </FormGroup>
            <FormGroup>
                <Label>📸 Add Pictures of your PG (comma separated URLs)</Label>
                <TextArea
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    placeholder="Paste image URLs here (e.g., https://example.com/room1.jpg, ...)"
                    rows={3}
                    style={{ borderColor: errors.images ? 'red' : '#ddd' }}
                />
                {errors.images && <small style={{ color: 'red' }}>{errors.images}</small>}
            </FormGroup>
            <Button type="submit" className="success">
                {editingPG ? 'Update PG' : 'Add PG'}
            </Button>
            <Button type="button" onClick={() => {
                setShowAddForm(false);
                setEditingPG(null);
                setErrors({});
            }}>
                Cancel
            </Button>
        </Form>
    );

    const renderMyPGs = () => (
        <>
            <div style={{ marginBottom: '20px' }}>
                <Button className="primary" onClick={() => setShowAddForm(true)}>
                    Add New PG
                </Button>
            </div>

            {showAddForm && renderPGForm()}

            <Table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Location</th>
                        <th>Price</th>
                        <th>Contact</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {pgs.map((pg) => (
                        <tr key={pg.id}>
                            <td>{pg.name}</td>
                            <td>{pg.location}</td>
                            <td>₹{pg.price}</td>
                            <td>{pg.contactNumber}</td>
                            <td>
                                <Button className="primary" onClick={() => {
                                    setActiveTab('bookings');
                                    loadBookings(pg.id);
                                }}>
                                    View Bookings
                                </Button>
                                <Button className="success" onClick={() => handleEdit(pg)}>
                                    Edit
                                </Button>
                                <Button className="danger" onClick={() => handleDelete(pg.id)}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );

    const renderBookings = () => (
        <Table>
            <thead>
                <tr>
                    <th>Booking ID</th>
                    <th>User Name</th>
                    <th>User Email</th>
                    <th>Check-in Date</th>
                    <th>Status</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                {bookings.map((booking) => (
                    <tr key={booking.id}>
                        <td>{booking.id}</td>
                        <td>{booking.userName}</td>
                        <td>{booking.userEmail}</td>
                        <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                        <td>{booking.status}</td>
                        <td>₹{booking.amount}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );

    return (
        <OwnerContainer>
            <h1>Owner Dashboard</h1>

            <TabContainer>
                <Tab active={activeTab === 'my-pgs'} onClick={() => setActiveTab('my-pgs')}>
                    My PGs
                </Tab>
                <Tab active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')}>
                    Bookings
                </Tab>
            </TabContainer>

            {activeTab === 'my-pgs' && renderMyPGs()}
            {activeTab === 'bookings' && renderBookings()}
        </OwnerContainer>
    );
};

export default OwnerDashboard;
