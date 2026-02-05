// src/components/Auth/Register.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { authAPI } from '../../services/api';
import { validateEmail, validatePassword, validateName, validatePhone } from '../../utils/validation';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 85vh;
  padding: 2rem;
  background: radial-gradient(circle at top right, rgba(14, 165, 233, 0.1), transparent),
              radial-gradient(circle at bottom left, rgba(20, 184, 166, 0.1), transparent);
`;

const FormCard = styled.div`
  background: var(--surface-color);
  padding: 3rem;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 500px;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--glass-border);
  animation: fadeIn 0.5s ease-out;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--gradient-primary);
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 800;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: var(--text-main);
  font-size: 0.95rem;
  margin-left: 0.25rem;
`;

const Input = styled.input`
  padding: 0.8rem 1.25rem;
  border: 2px solid ${props => props.hasError ? 'var(--error)' : '#e2e8f0'};
  border-radius: var(--radius-lg);
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #f8fafc;
  color: var(--text-main);
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? 'var(--error)' : 'var(--primary)'};
    background: white;
    box-shadow: 0 0 0 4px ${props => props.hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(14, 165, 233, 0.1)'};
  }
`;

const ErrorMessage = styled.span`
  color: var(--error);
  font-size: 0.85rem;
  margin-left: 0.25rem;
  font-weight: 500;
`;

const PasswordHint = styled.div`
  font-size: 0.8rem;
  color: var(--text-light);
  margin-top: 0.25rem;
  margin-left: 0.25rem;
`;

const Button = styled.button`
  background: var(--gradient-primary);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-glow);
  margin-top: 1rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-xl);
    filter: brightness(1.1);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: 2rem;
  color: var(--text-light);
  font-size: 0.95rem;
  
  a {
    color: var(--primary);
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s;
    
    &:hover {
      color: var(--primary-dark);
      text-decoration: underline;
    }
  }
`;

const RoleOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  background: ${props => props.checked ? 'var(--primary-light)' : '#f1f5f9'};
  color: ${props => props.checked ? 'white' : 'var(--text-main)'};
  border-radius: 50px;
  transition: all 0.2s;
  font-weight: 500;
  font-size: 0.9rem;
  border: 1px solid ${props => props.checked ? 'var(--primary)' : 'transparent'};

  &:hover {
    background: ${props => props.checked ? 'var(--primary)' : '#e2e8f0'};
  }
`;

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        role: 'User',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        const nameError = validateName(formData.fullName);
        if (nameError) newErrors.fullName = nameError;

        const emailError = validateEmail(formData.email);
        if (emailError) newErrors.email = emailError;

        const passwordError = validatePassword(formData.password);
        if (passwordError) newErrors.password = passwordError;

        const phoneError = validatePhone(formData.phone);
        if (phoneError) newErrors.phone = phoneError;

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await authAPI.register(
                formData.fullName,
                formData.email,
                formData.password,
                formData.phone,
                formData.role
            );
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            console.error('Registration error:', error);
            const message = error.response?.data?.message || error.message || 'Registration failed';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <Container>
            <FormCard>
                <Title>Create Account</Title>
                <Form onSubmit={handleSubmit}>
                    <InputGroup>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            hasError={!!errors.fullName}
                            placeholder="Enter your full name"
                        />
                        {errors.fullName && <ErrorMessage>{errors.fullName}</ErrorMessage>}
                    </InputGroup>

                    <InputGroup>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            hasError={!!errors.email}
                            placeholder="Enter your email"
                        />
                        {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                    </InputGroup>

                    <InputGroup>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            hasError={!!errors.phone}
                            placeholder="Enter your phone number"
                        />
                        {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
                    </InputGroup>

                    <InputGroup>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            hasError={!!errors.password}
                            placeholder="Create a strong password"
                        />
                        {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
                        <PasswordHint>
                            Password must be 8+ characters with uppercase, lowercase, number, and special character
                        </PasswordHint>
                    </InputGroup>

                    <InputGroup>
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            hasError={!!errors.confirmPassword}
                            placeholder="Confirm your password"
                        />
                        {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
                    </InputGroup>

                    <InputGroup>
                        <Label>Select Role</Label>
                        <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                            {['User', 'Owner', 'Donor'].map((role) => (
                                <RoleOption key={role} checked={formData.role === role}>
                                    <input
                                        type="radio"
                                        name="role"
                                        value={role}
                                        checked={formData.role === role}
                                        onChange={handleChange}
                                        style={{ display: 'none' }}
                                    />
                                    {role === 'User' && '👤'}
                                    {role === 'Owner' && '🏠'}
                                    {role === 'Donor' && '🎁'}
                                    {role}
                                </RoleOption>
                            ))}
                        </div>
                    </InputGroup>

                    <Button type="submit" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                </Form>

                <LinkText>
                    Already have an account? <Link to="/login">Sign in here</Link>
                </LinkText>
            </FormCard>
        </Container>
    );
};

export default Register;
