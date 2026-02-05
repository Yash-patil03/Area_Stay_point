import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { adminAPI, pgAPI, bookingAPI } from '../../services/api';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  color: white;
  text-align: center;
  margin-bottom: 2rem;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Tab = styled.button`
  background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(255,255,255,0.1)'};
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
`;

const Table = styled.table`
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const Th = styled.th`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  text-align: left;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #eee;
`;

const Button = styled.button`
  background: ${props => props.danger ? '#dc3545' : props.success ? '#28a745' : '#667eea'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 0.5rem;
  font-size: 0.8rem;
  
  &:hover {
    opacity: 0.8;
  }
`;

const SearchBox = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 1rem;
  width: 300px;
`;

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [pgs, setPGs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [donations, setDonations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'users':
          const usersRes = await adminAPI.getUsers();
          setUsers(usersRes.data);
          break;
        case 'pgs':
          const pgsRes = await pgAPI.getAllPGs();
          setPGs(pgsRes.data);
          break;
        case 'bookings':
          const bookingsRes = await adminAPI.getAllBookings();
          setBookings(bookingsRes.data);
          break;
        case 'donations':
          const donationsRes = await adminAPI.getAllDonations();
          setDonations(donationsRes.data);
          break;
        case 'reviews':
          const reviewsRes = await adminAPI.getAllReviews();
          setReviews(reviewsRes.data);
          break;
      }
    } catch (error) {
      toast.error(`Failed to load ${activeTab}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Delete this user?')) {
      try {
        await adminAPI.deleteUser(userId);
        toast.success('User deleted');
        loadData();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const deletePG = async (pgId) => {
    if (window.confirm('Delete this PG?')) {
      try {
        await pgAPI.deletePG(pgId);
        toast.success('PG deleted');
        loadData();
      } catch (error) {
        toast.error('Failed to delete PG');
      }
    }
  };

  const filteredData = () => {
    const term = searchTerm.toLowerCase();
    switch (activeTab) {
      case 'users':
        return users.filter(u => 
          u.fullName?.toLowerCase().includes(term) || 
          u.email?.toLowerCase().includes(term)
        );
      case 'pgs':
        return pgs.filter(p => 
          p.name?.toLowerCase().includes(term) || 
          p.city?.toLowerCase().includes(term)
        );
      case 'bookings':
        return bookings.filter(b => 
          b.userName?.toLowerCase().includes(term) || 
          b.pgName?.toLowerCase().includes(term)
        );
      default:
        return [];
    }
  };

  const renderUsers = () => (
    <Table>
      <thead>
        <tr>
          <Th>ID</Th>
          <Th>Name</Th>
          <Th>Email</Th>
          <Th>Phone</Th>
          <Th>Role</Th>
          <Th>Actions</Th>
        </tr>
      </thead>
      <tbody>
        {filteredData().map(user => (
          <tr key={user.userId}>
            <Td>{user.userId}</Td>
            <Td>{user.fullName}</Td>
            <Td>{user.email}</Td>
            <Td>{user.phone}</Td>
            <Td>{user.role}</Td>
            <Td>
              <Button danger onClick={() => deleteUser(user.userId)}>Delete</Button>
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderPGs = () => (
    <Table>
      <thead>
        <tr>
          <Th>ID</Th>
          <Th>Name</Th>
          <Th>City</Th>
          <Th>Rent</Th>
          <Th>Rooms</Th>
          <Th>Owner</Th>
          <Th>Actions</Th>
        </tr>
      </thead>
      <tbody>
        {filteredData().map(pg => (
          <tr key={pg.pgId}>
            <Td>{pg.pgId}</Td>
            <Td>{pg.name}</Td>
            <Td>{pg.city}</Td>
            <Td>₹{pg.rent}</Td>
            <Td>{pg.availableRooms}/{pg.totalRooms}</Td>
            <Td>{pg.owner?.fullName}</Td>
            <Td>
              <Button danger onClick={() => deletePG(pg.pgId)}>Delete</Button>
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const renderBookings = () => (
    <Table>
      <thead>
        <tr>
          <Th>ID</Th>
          <Th>User</Th>
          <Th>PG</Th>
          <Th>Date</Th>
          <Th>Status</Th>
        </tr>
      </thead>
      <tbody>
        {filteredData().map(booking => (
          <tr key={booking.bookingId}>
            <Td>{booking.bookingId}</Td>
            <Td>{booking.userName}</Td>
            <Td>{booking.pgName}</Td>
            <Td>{new Date(booking.bookingDate).toLocaleDateString()}</Td>
            <Td>{booking.status}</Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  if (loading) return <Container><Title>Loading...</Title></Container>;

  return (
    <Container>
      <Title>Admin Panel</Title>
      
      <TabContainer>
        <Tab active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
          Users ({users.length})
        </Tab>
        <Tab active={activeTab === 'pgs'} onClick={() => setActiveTab('pgs')}>
          PGs ({pgs.length})
        </Tab>
        <Tab active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')}>
          Bookings ({bookings.length})
        </Tab>
        <Tab active={activeTab === 'donations'} onClick={() => setActiveTab('donations')}>
          Donations ({donations.length})
        </Tab>
        <Tab active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')}>
          Reviews ({reviews.length})
        </Tab>
      </TabContainer>

      <SearchBox
        type="text"
        placeholder={`Search ${activeTab}...`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {activeTab === 'users' && renderUsers()}
      {activeTab === 'pgs' && renderPGs()}
      {activeTab === 'bookings' && renderBookings()}
      {activeTab === 'donations' && (
        <Table>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Donor</Th>
              <Th>Amount</Th>
              <Th>Purpose</Th>
              <Th>Date</Th>
            </tr>
          </thead>
          <tbody>
            {donations.map(donation => (
              <tr key={donation.donationId}>
                <Td>{donation.donationId}</Td>
                <Td>{donation.donorName}</Td>
                <Td>₹{donation.amount}</Td>
                <Td>{donation.purpose}</Td>
                <Td>{new Date(donation.donationDate).toLocaleDateString()}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {activeTab === 'reviews' && (
        <Table>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>User</Th>
              <Th>PG</Th>
              <Th>Rating</Th>
              <Th>Comment</Th>
              <Th>Date</Th>
            </tr>
          </thead>
          <tbody>
            {reviews.map(review => (
              <tr key={review.reviewId}>
                <Td>{review.reviewId}</Td>
                <Td>{review.userName}</Td>
                <Td>{review.pgName}</Td>
                <Td>{'⭐'.repeat(review.rating)}</Td>
                <Td>{review.comment}</Td>
                <Td>{new Date(review.createdAt).toLocaleDateString()}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default AdminPanel;