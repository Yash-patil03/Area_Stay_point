import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { toast } from 'react-toastify';
import { discountAPI } from '../services/api';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  animation: ${fadeIn} 0.6s ease-out;
`;

const Header = styled.div`
  margin-bottom: 2.5rem;
  
  h2 {
    font-size: 2.5rem;
    font-weight: 800;
    margin: 0;
    display: inline-block;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  p {
    color: var(--text-light);
    margin-top: 0.5rem;
    font-size: 1.1rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background: var(--surface-color);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid rgba(255,255,255,0.5);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-xl);
  }
`;

const CardHeader = styled.div`
  border-bottom: 1px solid #edf2f7;
  padding-bottom: 1rem;
  h3 { margin: 0; color: #2d3748; font-size: 1.2rem; }
  span { font-size: 0.85rem; color: #718096; }
`;

const CardBody = styled.div`
  .row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
  }
  .label { color: #718096; }
  .value { font-weight: 600; color: #2d3748; }
  
  .highlight {
    color: #ecc94b; /* Goldish for scholarship */
    font-size: 1.5rem;
    font-weight: 700;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: auto;
`;

const Button = styled.button`
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.1s;
  
  &:active { transform: scale(0.98); }
  
  &.approve {
    background: #48bb78;
    color: white;
  }
  &.reject {
    background: #f56565;
    color: white;
  }
`;

const DonorDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editPercents, setEditPercents] = useState({});
  const [view, setView] = useState('pending'); // 'pending' or 'history'

  useEffect(() => {
    loadRequests();
  }, [view]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const response = view === 'pending'
        ? await discountAPI.getPendingRequests()
        : await discountAPI.getHistory();

      setRequests(response.data);

      if (view === 'pending') {
        // Initialize edit values
        const initialPercents = {};
        response.data.forEach(r => {
          initialPercents[r.requestId] = r.discountPercent;
        });
        setEditPercents(initialPercents);
      }
    } catch (error) {
      console.error("Failed to load requests", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    // ... same as before
    const approvedPercent = editPercents[id];
    try {
      await discountAPI.approveRequest(id, parseInt(approvedPercent));
      toast.success(`Scholarship Approved at ${approvedPercent}%!`);
      loadRequests();
    } catch (error) {
      toast.error("Failed to approve request");
    }
  };

  const handleReject = async (id) => {
    // ... same as before
    if (!window.confirm("Are you sure you want to reject this request?")) return;
    try {
      await discountAPI.rejectRequest(id);
      toast.info("Request Rejected");
      loadRequests();
    } catch (error) {
      toast.error("Failed to reject request");
    }
  };

  const TabButton = styled.button`
      background: ${props => props.active ? 'var(--gradient-primary)' : 'white'};
      border: 1px solid ${props => props.active ? 'transparent' : '#e2e8f0'};
      color: ${props => props.active ? 'white' : 'var(--text-light)'};
      padding: 0.6rem 1.25rem;
      cursor: pointer;
      border-radius: 50px;
      font-weight: 600;
      margin-right: 1rem;
      transition: all 0.2s;
      box-shadow: ${props => props.active ? 'var(--shadow-glow)' : 'none'};

      &:hover { 
        transform: translateY(-2px);
        color: ${props => props.active ? 'white' : 'var(--primary)'};
      }
  `;

  return (
    <DashboardContainer>
      <Header>
        <h2>Donor Dashboard</h2>
        <p>Review and approve scholarship requests from students.</p>
        <div style={{ marginTop: '1.5rem' }}>
          <TabButton active={view === 'pending'} onClick={() => setView('pending')}>Pending Requests</TabButton>
          <TabButton active={view === 'history'} onClick={() => setView('history')}>Approved History</TabButton>
        </div>
      </Header>

      {loading ? (
        <div style={{ color: 'var(--text-light)', textAlign: 'center' }}>Loading...</div>
      ) : requests.length === 0 ? (
        <div style={{ color: 'var(--text-main)', textAlign: 'center', background: 'var(--surface-color)', padding: '3rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No {view === 'pending' ? 'Pending' : 'Past'} Requests</h3>
          <p style={{ color: 'var(--text-light)' }}>{view === 'pending' ? "You're all caught up! No scholarships to review." : "No history available."}</p>
        </div>
      ) : (
        <Grid>
          {requests.map(req => (
            <Card key={req.requestId}>
              <CardHeader>
                <h3>Request #{req.requestId}</h3>
                <span>{new Date().toLocaleDateString()}</span>
              </CardHeader>
              <CardBody>
                <div className="row">
                  <span className="label">Student</span>
                  <div style={{ textAlign: 'right' }}>
                    <div className="value">{req.user?.fullName || 'Unknown Student'}</div>
                    <div style={{ fontSize: '0.8rem', color: '#718096' }}>{req.user?.email}</div>
                    <div style={{ fontSize: '0.8rem', color: '#718096' }}>{req.user?.phone}</div>
                  </div>
                </div>
                <div className="row" style={{ marginTop: '0.5rem' }}>
                  <span className="label">Property</span>
                  <div style={{ textAlign: 'right' }}>
                    <div className="value">{req.pg?.name || 'Unknown PG'}</div>
                    <div style={{ fontSize: '0.8rem', color: '#718096' }}>{req.pg?.city}, {req.pg?.area}</div>
                    <div style={{ fontSize: '0.85rem', color: '#2d3748', marginTop: '2px' }}>Rent: ₹{req.pg?.rent?.toLocaleString()}</div>
                  </div>
                </div>
                <div className="row" style={{ alignItems: 'center', marginTop: '1rem', borderTop: '1px dashed #e2e8f0', paddingTop: '1rem' }}>
                  <span className="label">Requested / Approved %</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={editPercents[req.requestId] || ''}
                      onChange={(e) => setEditPercents({ ...editPercents, [req.requestId]: e.target.value })}
                      style={{ width: '60px', padding: '0.25rem', borderRadius: '4px', border: '1px solid #cbd5e0', textAlign: 'center' }}
                    />
                    <span style={{ fontWeight: 'bold' }}>%</span>
                  </div>
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#4a5568', fontStyle: 'italic', background: '#f7fafc', padding: '0.75rem', borderRadius: '8px' }}>
                  "{req.reason || 'Financial assistance required'}"
                </div>
              </CardBody>
              {view === 'pending' ? (
                <ButtonGroup>
                  <Button className="reject" onClick={() => handleReject(req.requestId)} style={{ background: '#fee2e2', color: '#dc2626' }}>Reject</Button>
                  <Button className="approve" onClick={() => handleApprove(req.requestId)} style={{ background: 'var(--gradient-primary)', color: 'white', padding: '0.75rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Approve</Button>
                </ButtonGroup>
              ) : (
                <div style={{ marginTop: '1rem', textAlign: 'center', padding: '0.5rem', borderRadius: '8px', background: req.status === 'Approved' ? '#c6f6d5' : '#fed7d7', color: req.status === 'Approved' ? '#22543d' : '#822727', fontWeight: 'bold' }}>
                  {req.status} ({req.discountPercent}%)
                </div>
              )}
            </Card>
          ))}
        </Grid>
      )}
    </DashboardContainer>
  );
};

export default DonorDashboard;
