import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { ownerAPI } from '../../services/api';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const FormCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  font-size: 2rem;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  &.full-width {
    grid-column: 1 / -1;
  }
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  padding: 1rem;
  border: 2px solid #e1e8ed;
  border-radius: 10px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Select = styled.select`
  padding: 1rem;
  border: 2px solid #e1e8ed;
  border-radius: 10px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const TextArea = styled.textarea`
  padding: 1rem;
  border: 2px solid #e1e8ed;
  border-radius: 10px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  grid-column: 1 / -1;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const AddPG = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    rent: '',
    totalRooms: '',
    availableRooms: '',
    pgType: 'Single',
    gender: 'Male',
    isAC: false,
    hasWiFi: false,
    hasParking: false,
    hasLaundry: false,
    mealsIncluded: false,
    hasKitchen: false,
    description: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await ownerAPI.addPG(formData);
      toast.success('PG added successfully!');
      navigate('/owner/pgs');
    } catch (error) {
      toast.error('Failed to add PG');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <FormCard>
        <Title>Add New PG</Title>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label>PG Name</Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>City</Label>
            <Input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup className="full-width">
            <Label>Address</Label>
            <Input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>State</Label>
            <Input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>Pincode</Label>
            <Input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>Monthly Rent (₹)</Label>
            <Input
              type="number"
              name="rent"
              value={formData.rent}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>Total Rooms</Label>
            <Input
              type="number"
              name="totalRooms"
              value={formData.totalRooms}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>Available Rooms</Label>
            <Input
              type="number"
              name="availableRooms"
              value={formData.availableRooms}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Label>PG Type</Label>
            <Select name="pgType" value={formData.pgType} onChange={handleChange}>
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Triple">Triple</option>
            </Select>
          </InputGroup>

          <InputGroup>
            <Label>Gender</Label>
            <Select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Both">Both</option>
            </Select>
          </InputGroup>

          <InputGroup className="full-width">
            <Label>Description</Label>
            <TextArea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your PG..."
            />
          </InputGroup>

          <Button type="submit" disabled={loading}>
            {loading ? 'Adding PG...' : 'Add PG'}
          </Button>
        </Form>
      </FormCard>
    </Container>
  );
};

export default AddPG;