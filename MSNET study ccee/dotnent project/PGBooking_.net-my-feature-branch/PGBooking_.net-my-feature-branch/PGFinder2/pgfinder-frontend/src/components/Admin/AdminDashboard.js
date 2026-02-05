// src/components/Admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { adminAPI, pgAPI } from '../../services/api';
import { toast } from 'react-toastify';
import styled from 'styled-components';

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: var(--surface-color);
  padding: 2rem;
  border-radius: var(--radius-lg);
  width: 400px;
  max-width: 90%;
  box-shadow: var(--shadow-xl);
`;

const ModalTitle = styled.h3`
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--text-main);
  }
  
  input, select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: var(--radius-md);
    background: #f8fafc;
    &:focus { outline: none; border-color: var(--primary); }
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const AdminContainer = styled.div`
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
  background: transparent;
  color: ${props => props.active ? 'var(--primary)' : 'var(--text-light)'};
  cursor: pointer;
  border-bottom: 2px solid ${props => props.active ? 'var(--primary)' : 'transparent'};
  font-weight: ${props => props.active ? '600' : '400'};
  transition: all 0.2s;
  
  &:hover {
    color: var(--primary);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #f1f5f9;
    color: var(--text-main);
  }
  
  th {
    background-color: #f8fafc;
    font-weight: 600;
    color: var(--text-light);
  }
`;

const Button = styled.button`
  padding: 6px 12px;
  margin: 0 4px;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 500;
  transition: opacity 0.2s;
  
  &.edit { background: var(--secondary); color: white; }
  &.delete { background: var(--accent); color: white; }
  &.view { background: var(--primary); color: white; }
  
  &:hover { opacity: 0.9; }
`;

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('pgs');
    const [pgs, setPgs] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [users, setUsers] = useState([]);
    const [payments, setPayments] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [editFormData, setEditFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        role: ''
    });

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        try {
            switch (activeTab) {
                case 'pgs':
                    const pgResponse = await pgAPI.getAllPGs();
                    setPgs(pgResponse.data);
                    break;
                case 'bookings':
                    const bookingResponse = await adminAPI.getAllBookings();
                    setBookings(bookingResponse.data);
                    break;
                case 'users':
                    const userResponse = await adminAPI.getAllUsers();
                    setUsers(userResponse.data);
                    break;
                case 'payments':
                    const paymentResponse = await adminAPI.getAllPayments();
                    setPayments(paymentResponse.data);
                    break;
                default:
                    break;
            }
        } catch (error) {
            toast.error('Failed to load data');
        }
    };

    const handleDeletePG = async (id) => {
        if (window.confirm('Are you sure you want to delete this PG?')) {
            try {
                await pgAPI.deletePG(id);
                toast.success('PG deleted successfully');
                loadData();
            } catch (error) {
                toast.error('Failed to delete PG');
            }
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await adminAPI.deleteUser(id);
                toast.success('User deleted successfully');
                loadData();
            } catch (error) {
                toast.error('Failed to delete user');
            }
        }
    };

    const renderPGs = () => (
        <Table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Price</th>
                    <th>Owner</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {pgs.map((pg) => (
                    <tr key={pg.id}>
                        <td>{pg.id}</td>
                        <td>{pg.name}</td>
                        <td>{pg.location}</td>
                        <td>₹{pg.price}</td>
                        <td>{pg.ownerName}</td>
                        <td>
                            <Button className="view">View</Button>
                            <Button className="edit">Edit</Button>
                            <Button className="delete" onClick={() => handleDeletePG(pg.id)}>Delete</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );

    const renderBookings = () => (
        <Table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>PG Name</th>
                    <th>User</th>
                    <th>Check-in</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {bookings.map((booking) => (
                    <tr key={booking.id}>
                        <td>{booking.id}</td>
                        <td>{booking.pgName}</td>
                        <td>{booking.userName}</td>
                        <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                        <td>{booking.status}</td>
                        <td>₹{booking.amount}</td>
                        <td>
                            <Button className="view">View Details</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );

    const renderUsers = () => (
        <Table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Phone</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.fullName}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{user.phone}</td>
                        <td>
                            <Button className="view" onClick={() => handleEditUser(user)}>Edit</Button>
                            <Button className="delete" onClick={() => handleDeleteUser(user.id)}>Delete</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );

    const renderPayments = () => (
        <Table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Booking ID</th>
                    <th>User</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                {payments.map((payment) => (
                    <tr key={payment.id}>
                        <td>{payment.id}</td>
                        <td>{payment.bookingId}</td>
                        <td>{payment.userName}</td>
                        <td>₹{payment.amount}</td>
                        <td>{payment.status}</td>
                        <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );

    const handleEditUser = (user) => {
        setEditingUser(user);
        setEditFormData({
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            role: user.role
        });
    };

    const handleUpdateUser = async () => {
        try {
            await adminAPI.updateUser(editingUser.id, editFormData);
            toast.success('User updated successfully');
            setEditingUser(null);
            loadData();
        } catch (error) {
            toast.error('Failed to update user');
        }
    };

    const renderEditUserModal = () => {
        if (!editingUser) return null;

        return (
            <Modal>
                <ModalContent>
                    <ModalTitle>Edit User</ModalTitle>
                    <FormGroup>
                        <label>Full Name</label>
                        <input
                            value={editFormData.fullName}
                            onChange={e => setEditFormData({ ...editFormData, fullName: e.target.value })}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>Email</label>
                        <input
                            value={editFormData.email}
                            onChange={e => setEditFormData({ ...editFormData, email: e.target.value })}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>Phone</label>
                        <input
                            value={editFormData.phone}
                            onChange={e => setEditFormData({ ...editFormData, phone: e.target.value })}
                        />
                    </FormGroup>
                    <FormGroup>
                        <label>Role</label>
                        <select
                            value={editFormData.role}
                            onChange={e => setEditFormData({ ...editFormData, role: e.target.value })}
                        >
                            <option value="User">User</option>
                            <option value="Owner">Owner</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </FormGroup>
                    <ModalActions>
                        <Button onClick={() => setEditingUser(null)} style={{ background: '#6c757d', color: 'white' }}>Cancel</Button>
                        <Button onClick={handleUpdateUser} style={{ background: '#007bff', color: 'white' }}>Save</Button>
                    </ModalActions>
                </ModalContent>
            </Modal>
        );
    };

    return (
        <AdminContainer>
            <h1>Admin Dashboard</h1>

            <TabContainer>
                <Tab active={activeTab === 'pgs'} onClick={() => setActiveTab('pgs')}>
                    PG Management
                </Tab>
                <Tab active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')}>
                    Bookings
                </Tab>
                <Tab active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
                    Users
                </Tab>
                <Tab active={activeTab === 'payments'} onClick={() => setActiveTab('payments')}>
                    Payments
                </Tab>
            </TabContainer>

            {activeTab === 'pgs' && renderPGs()}
            {activeTab === 'bookings' && renderBookings()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'payments' && renderPayments()}

            {renderEditUserModal()}
        </AdminContainer>
    );
};

export default AdminDashboard;
