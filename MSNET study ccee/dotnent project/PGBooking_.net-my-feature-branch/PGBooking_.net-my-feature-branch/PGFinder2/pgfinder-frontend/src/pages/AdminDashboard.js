// src/pages/AdminDashboard.js
import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import styled, { keyframes, css } from 'styled-components';
import { adminAPI } from '../services/api';

// --- Styled Components & Animations ---

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
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

const TabGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;

  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 2px;
  }
`;

const TabButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  background: ${props => props.active ? 'var(--gradient-primary)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--text-light)'};
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: ${props => props.active ? 'var(--shadow-glow)' : 'none'};

  &:hover {
    background: ${props => props.active ? 'var(--gradient-primary)' : 'var(--bg-color)'};
    color: ${props => props.active ? 'white' : 'var(--text-secondary)'};
    transform: translateY(-2px);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: var(--gradient-primary);
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  }

  h5 {
    color: #718096;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
  }

  h3 {
    font-size: 2rem;
    font-weight: 700;
    color: #2d3748;
    margin: 0;
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease-out;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    background: #f8fafc;
    color: #4a5568;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.85rem;
    letter-spacing: 0.05em;
    padding: 1.25rem 1.5rem;
    text-align: left;
    border-bottom: 2px solid #edf2f7;
  }

  td {
    padding: 1.25rem 1.5rem;
    color: #2d3748;
    border-bottom: 1px solid #edf2f7;
    vertical-align: middle;
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover {
    background-color: #f7fafc;
  }
`;

const StatusBadge = styled.span`
  padding: 0.35rem 0.75rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-block;
  text-transform: capitalize;
  
  ${props => {
        const status = props.status?.toLowerCase() || '';
        if (status === 'active' || status === 'confirmed' || status === 'success') {
            return css`background: #c6f6d5; color: #22543d;`;
        } else if (status === 'pending' || status === 'processing') {
            return css`background: #feebc8; color: #744210;`;
        } else {
            return css`background: #fed7d7; color: #822727;`;
        }
    }}
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-right: 0.5rem;
  
  ${props => {
        switch (props.variant) {
            case 'danger':
                return css`
          background: #fff5f5;
          color: #c53030;
          &:hover { background: #fed7d7; }
        `;
            case 'warning':
                return css`
          background: #fffaf0;
          color: #c05621;
          &:hover { background: #feebc8; }
        `;
            default: // primary
                return css`
          background: var(--gradient-primary);
          color: white;
          &:hover { opacity: 0.9; transform: translateY(-1px); }
        `;
        }
    }}
`;

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
  padding: 2.5rem;
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);

  h3 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: #2d3748;
    font-size: 1.5rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #4a5568;
    font-weight: 500;
  }

  input, select, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    font-size: 1rem;
    transition: border-color 0.2s;

    &:focus {
      outline: none;
      border-color: #667eea;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('stats');
    const [pgs, setPGs] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [payments, setPayments] = useState([]);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPGModal, setShowPGModal] = useState(false);
    const [editingPG, setEditingPG] = useState(null);
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
        latitude: 0,
        longitude: 0,
        ownerId: 0
    });

    const [showUserModal, setShowUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [userForm, setUserForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        role: 'User'
    });

    // --- Sorting and Searching State ---
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

    // --- Processed Bookings (Filtered & Sorted) ---
    const processedBookings = React.useMemo(() => {
        let filtered = [...bookings];

        // 1. Search Filter
        if (searchTerm.trim()) {
            const lowerTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(b =>
                (b.user?.fullName?.toLowerCase() || '').includes(lowerTerm) ||
                (b.pg?.name?.toLowerCase() || '').includes(lowerTerm) ||
                (b.status?.toLowerCase() || '').includes(lowerTerm)
            );
        }

        // 2. Sorting
        filtered.sort((a, b) => {
            let aVal, bVal;

            switch (sortConfig.key) {
                case 'amount':
                    aVal = a.finalAmount || 0;
                    bVal = b.finalAmount || 0;
                    break;
                case 'user':
                    aVal = a.user?.fullName || '';
                    bVal = b.user?.fullName || '';
                    break;
                case 'pg':
                    aVal = a.pg?.name || '';
                    bVal = b.pg?.name || '';
                    break;
                case 'date':
                default:
                    // new users might have date as string or Date object
                    aVal = new Date(a.bookingDate || 0).getTime();
                    bVal = new Date(b.bookingDate || 0).getTime();
                    break;
            }

            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [bookings, searchTerm, sortConfig]);

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            switch (activeTab) {
                case 'pgs':
                    const pgsRes = await adminAPI.getPGs();
                    setPGs(pgsRes.data);
                    break;
                case 'bookings':
                    const bookingsRes = await adminAPI.getAllBookings();
                    setBookings(bookingsRes.data);
                    break;
                case 'payments':
                    const paymentsRes = await adminAPI.getAllPayments();
                    setPayments(paymentsRes.data);
                    break;
                case 'users':
                    const usersRes = await adminAPI.getAllUsers();
                    setUsers(usersRes.data);
                    break;
                case 'stats':
                    const statsRes = await adminAPI.getStats();
                    setStats(statsRes.data);
                    break;
                default:
                    break;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleAddPG = () => {
        setEditingPG(null);
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
            latitude: 0,
            longitude: 0,
            ownerId: 0
        });
        setShowPGModal(true);
    };

    const handleEditPG = (pg) => {
        setEditingPG(pg);
        setPGForm({
            name: pg.name,
            address: pg.address,
            city: pg.city,
            area: pg.area,
            rent: pg.rent,
            capacity: pg.capacity,
            availableSlots: pg.availableSlots,
            genderAllowed: pg.genderAllowed,
            description: '',
            latitude: 0,
            longitude: 0,
            ownerId: 0
        });
        setShowPGModal(true);
    };

    const handleSavePG = async () => {
        try {
            if (editingPG) {
                await adminAPI.updatePG(editingPG.pgId, pgForm);
                toast.success('PG updated successfully');
            } else {
                await adminAPI.createPG(pgForm);
                toast.success('PG added successfully');
            }
            setShowPGModal(false);
            loadData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save PG');
        }
    };

    const handleDeletePG = async (id) => {
        if (!window.confirm('Are you sure you want to delete this PG?')) return;

        try {
            await adminAPI.deletePG(id);
            toast.success('PG deleted successfully');
            loadData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete PG');
        }
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setUserForm({
            fullName: user.fullName || '',
            email: user.email || '',
            phone: user.phone || '',
            role: user.role || 'User'
        });
        setShowUserModal(true);
    };

    const handleSaveUser = async () => {
        try {
            if (editingUser) {
                await adminAPI.updateUser(editingUser.userId, userForm);
                toast.success('User updated successfully');
                setShowUserModal(false);
                loadData();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update user');
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
        try {
            await adminAPI.deleteUser(id);
            toast.success('User deleted successfully');
            loadData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete user');
        }
    };

    return (
        <DashboardContainer>
            <Header>
                <h2>Admin Portal</h2>
                {activeTab === 'pgs' && (
                    <ActionButton onClick={handleAddPG}>
                        + Add New PG
                    </ActionButton>
                )}
            </Header>

            <TabGroup>
                <TabButton active={activeTab === 'stats'} onClick={() => setActiveTab('stats')}>
                    Overview
                </TabButton>
                <TabButton active={activeTab === 'pgs'} onClick={() => setActiveTab('pgs')}>
                    PG Listings
                </TabButton>
                <TabButton active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')}>
                    Bookings
                </TabButton>
                <TabButton active={activeTab === 'payments'} onClick={() => setActiveTab('payments')}>
                    Financials
                </TabButton>
                <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
                    User Management
                </TabButton>
            </TabGroup>

            {/* Statistics Tab */}
            {activeTab === 'stats' && stats && (
                <StatsGrid>
                    <StatCard>
                        <h5>Total Users</h5>
                        <h3>{stats.totalUsers}</h3>
                    </StatCard>
                    <StatCard>
                        <h5>Total PGs</h5>
                        <h3>{stats.totalPGs}</h3>
                    </StatCard>
                    <StatCard>
                        <h5>Active Bookings</h5>
                        <h3>{stats.totalBookings}</h3>
                    </StatCard>
                    <StatCard>
                        <h5>Total Revenue</h5>
                        <h3>₹{stats.totalRevenue?.toLocaleString('en-IN') || 0}</h3>
                    </StatCard>
                </StatsGrid>
            )}

            {/* PGs Tab */}
            {activeTab === 'pgs' && (
                <>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <TableContainer>
                            <StyledTable>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Location</th>
                                        <th>Rent</th>
                                        <th>Owner</th>
                                        <th>Stats</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pgs.map(pg => (
                                        <tr key={pg.pgId}>
                                            <td>
                                                <strong>{pg.name}</strong><br />
                                                <small>{pg.genderAllowed} PG</small>
                                            </td>
                                            <td>
                                                {pg.area}, {pg.city}<br />
                                                <small className="text-muted">{pg.address}</small>
                                            </td>
                                            <td>₹{pg.rent}/mo</td>
                                            <td>{pg.ownerName}</td>
                                            <td>{pg.totalBookings} Bookings</td>
                                            <td><StatusBadge status={pg.isActive ? 'Active' : 'Inactive'}>{pg.isActive ? 'Active' : 'Inactive'}</StatusBadge></td>
                                            <td>
                                                <ActionButton variant="warning" onClick={() => handleEditPG(pg)}>Edit</ActionButton>
                                                <ActionButton variant="danger" onClick={() => handleDeletePG(pg.pgId)}>Delete</ActionButton>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </StyledTable>
                        </TableContainer>
                    )}
                </>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
                <>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <input
                                type="text"
                                placeholder="🔍 Search by User or PG Name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '10px',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '0.95rem'
                                }}
                            />
                        </div>
                        <select
                            value={sortConfig.key}
                            onChange={(e) => setSortConfig({ ...sortConfig, key: e.target.value })}
                            style={{
                                padding: '0.75rem 1rem',
                                borderRadius: '10px',
                                border: '1px solid #e2e8f0',
                                cursor: 'pointer',
                                background: 'white'
                            }}
                        >
                            <option value="date">Sort by Date</option>
                            <option value="amount">Sort by Amount</option>
                            <option value="user">Sort by User</option>
                            <option value="pg">Sort by PG</option>
                        </select>
                        <button
                            onClick={() => setSortConfig(prev => ({ ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' }))}
                            style={{
                                padding: '0.75rem',
                                borderRadius: '10px',
                                border: '1px solid #e2e8f0',
                                background: 'white',
                                cursor: 'pointer',
                                width: '50px'
                            }}
                        >
                            {sortConfig.direction === 'asc' ? '⬆️' : '⬇️'}
                        </button>
                    </div>

                    <TableContainer>
                        <StyledTable>
                            <thead>
                                <tr>
                                    <th>User Details</th>
                                    <th>PG Info</th>
                                    <th>Timeline</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {processedBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#718096' }}>
                                            No bookings found matching your search.
                                        </td>
                                    </tr>
                                ) : (
                                    processedBookings.map(booking => (
                                        <tr key={booking.bookingId}>
                                            <td>
                                                <strong>{booking.user?.fullName}</strong><br />
                                                <small>{booking.user?.email}</small>
                                            </td>
                                            <td>{booking.pg?.name}</td>
                                            <td>
                                                In: {(new Date(booking.checkInDate).getFullYear() <= 1) ? 'Pending' : new Date(booking.checkInDate).toLocaleDateString()}<br />
                                                Out: {(new Date(booking.checkOutDate).getFullYear() <= 1) ? 'Pending' : new Date(booking.checkOutDate).toLocaleDateString()}
                                            </td>
                                            <td>₹{booking.finalAmount}</td>
                                            <td><StatusBadge status={booking.status}>{booking.status}</StatusBadge></td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </StyledTable>
                    </TableContainer>
                </>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
                <TableContainer>
                    <StyledTable>
                        <thead>
                            <tr>
                                <th>Booking Ref</th>
                                <th>Payer</th>
                                <th>PG</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Transaction ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map(payment => (
                                <tr key={payment.paymentId}>
                                    <td>#{payment.booking.bookingId}</td>
                                    <td>
                                        <strong>{payment.booking.user.fullName}</strong><br />
                                        <small>{payment.booking.user.email}</small>
                                    </td>
                                    <td>{payment.booking.pg.name}</td>
                                    <td>₹{payment.amount}</td>
                                    <td><StatusBadge status={payment.paymentStatus}>{payment.paymentStatus}</StatusBadge></td>
                                    <td><code>{payment.transactionId}</code></td>
                                </tr>
                            ))}
                        </tbody>
                    </StyledTable>
                </TableContainer>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
                <TableContainer>
                    <StyledTable>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Contact</th>
                                <th>Role</th>
                                <th>ID</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.userId}>
                                    <td>
                                        <strong>{user.fullName}</strong><br />
                                        <small>{user.email}</small>
                                    </td>
                                    <td>{user.phone}</td>
                                    <td><StatusBadge status="active">{user.role}</StatusBadge></td>
                                    <td>#{user.userId}</td>
                                    <td>
                                        <ActionButton variant="warning" onClick={() => handleEditUser(user)}>Edit</ActionButton>
                                        <ActionButton variant="danger" onClick={() => handleDeleteUser(user.userId)}>Delete</ActionButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </StyledTable>
                </TableContainer>
            )}

            {/* PG Modal */}
            {showPGModal && (
                <ModalOverlay onClick={() => setShowPGModal(false)}>
                    <ModalContent onClick={e => e.stopPropagation()}>
                        <h3>{editingPG ? 'Edit Property' : 'Add New Property'}</h3>

                        <FormGroup>
                            <label>PG Name</label>
                            <input type="text" value={pgForm.name} onChange={(e) => setPGForm({ ...pgForm, name: e.target.value })} />
                        </FormGroup>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <FormGroup>
                                <label>City</label>
                                <input type="text" value={pgForm.city} onChange={(e) => setPGForm({ ...pgForm, city: e.target.value })} />
                            </FormGroup>
                            <FormGroup>
                                <label>Area</label>
                                <input type="text" value={pgForm.area} onChange={(e) => setPGForm({ ...pgForm, area: e.target.value })} />
                            </FormGroup>
                        </div>

                        <FormGroup>
                            <label>Full Address</label>
                            <input type="text" value={pgForm.address} onChange={(e) => setPGForm({ ...pgForm, address: e.target.value })} />
                        </FormGroup>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                            <FormGroup>
                                <label>Rent (₹)</label>
                                <input type="number" value={pgForm.rent} onChange={(e) => setPGForm({ ...pgForm, rent: parseFloat(e.target.value) })} />
                            </FormGroup>
                            <FormGroup>
                                <label>Capacity</label>
                                <input type="number" value={pgForm.capacity} onChange={(e) => setPGForm({ ...pgForm, capacity: parseInt(e.target.value) })} />
                            </FormGroup>
                            <FormGroup>
                                <label>Vacant</label>
                                <input type="number" value={pgForm.availableSlots} onChange={(e) => setPGForm({ ...pgForm, availableSlots: parseInt(e.target.value) })} />
                            </FormGroup>
                        </div>

                        <FormGroup>
                            <label>Gender Allowance</label>
                            <select value={pgForm.genderAllowed} onChange={(e) => setPGForm({ ...pgForm, genderAllowed: e.target.value })}>
                                <option value="Male">Male Only</option>
                                <option value="Female">Female Only</option>
                                <option value="Both">Co-ed (Both)</option>
                            </select>
                        </FormGroup>

                        <ButtonGroup>
                            <ActionButton variant="warning" onClick={() => setShowPGModal(false)}>Cancel</ActionButton>
                            <ActionButton onClick={handleSavePG}>Save Changes</ActionButton>
                        </ButtonGroup>
                    </ModalContent>
                </ModalOverlay>
            )}

            {/* User Edit Modal */}
            {showUserModal && (
                <ModalOverlay onClick={() => setShowUserModal(false)}>
                    <ModalContent onClick={e => e.stopPropagation()}>
                        <h3>Edit User</h3>
                        <FormGroup>
                            <label>Full Name</label>
                            <input type="text" value={userForm.fullName} onChange={e => setUserForm({ ...userForm, fullName: e.target.value })} />
                        </FormGroup>
                        <FormGroup>
                            <label>Email</label>
                            <input type="email" value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} />
                        </FormGroup>
                        <FormGroup>
                            <label>Phone</label>
                            <input type="text" value={userForm.phone} onChange={e => setUserForm({ ...userForm, phone: e.target.value })} />
                        </FormGroup>
                        <FormGroup>
                            <label>Role</label>
                            <select value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })}>
                                <option value="User">User</option>
                                <option value="Owner">Owner</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </FormGroup>
                        <ButtonGroup>
                            <ActionButton variant="warning" onClick={() => setShowUserModal(false)}>Cancel</ActionButton>
                            <ActionButton onClick={handleSaveUser}>Save Changes</ActionButton>
                        </ButtonGroup>
                    </ModalContent>
                </ModalOverlay>
            )}
        </DashboardContainer>
    );
};

export default AdminDashboard;
