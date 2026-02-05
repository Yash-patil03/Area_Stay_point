// src/components/Auth/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import { validateEmail, validateRequired } from '../../utils/validation';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 85vh;
  padding: 2rem;
  background: radial-gradient(circle at top left, rgba(14, 165, 233, 0.1), transparent),
              radial-gradient(circle at bottom right, rgba(20, 184, 166, 0.1), transparent);
`;

const FormCard = styled.div`
  background: var(--surface-color);
  padding: 3rem;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 450px;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--glass-border);
  animation: fadeIn 0.5s ease-out;

  /* Top decorative line */
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
  margin-bottom: 2.5rem;
  font-size: 2rem;
  font-weight: 800;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  padding: 1rem 1.25rem;
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

  &::placeholder {
    color: #94a3b8;
  }
`;

const ErrorMessage = styled.span`
  color: var(--error);
  font-size: 0.85rem;
  margin-left: 0.25rem;
  font-weight: 500;
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

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validateRequired(formData.password, 'Password');
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await authAPI.login(formData.email, formData.password);
      const { token, user: userData } = response.data;

      console.log('Login response user:', userData); // Debug log

      // Handle case sensitivity (PascalCase from C# vs camelCase)
      const user = {
        email: userData.email || userData.Email,
        fullName: userData.fullName || userData.FullName,
        phone: userData.phone || userData.Phone,
        role: userData.role || userData.Role,
        id: userData.userId || userData.UserId
      };

      if (!user.email || !user.role) {
        console.error('Missing critical user data', user);
        toast.error('Login failed: Invalid server response');
        setLoading(false);
        return;
      }

      login(user.email, token, user.role, user.fullName);
      toast.success('Login successful!');

      // Redirect based on role
      const role = user.role; // already normalized above
      if (role === 'Admin') {
        navigate('/admin');
      } else if (role === 'Owner') {
        navigate('/owner-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || error.message || 'Login failed';
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
        <Title>Welcome Back</Title>
        <Form onSubmit={handleSubmit}>
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
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              hasError={!!errors.password}
              placeholder="Enter your password"
            />
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          </InputGroup>

          <Button type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </Form>

        <LinkText>
          Don't have an account? <Link to="/register">Sign up here</Link>
        </LinkText>
      </FormCard>
    </Container>
  );
};

export default Login;
