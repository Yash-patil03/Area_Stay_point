// src/components/APITest.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { authAPI } from '../services/api';

const Container = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
`;

const Button = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  margin: 0.5rem;
`;

const Result = styled.pre`
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 5px;
  margin-top: 1rem;
  white-space: pre-wrap;
`;

const APITest = () => {
  const [result, setResult] = useState('');

  const testLogin = async () => {
    try {
      setResult('Testing login...');
      const response = await authAPI.login('admin@pgfinder.com', 'Admin@123');
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}\nResponse: ${JSON.stringify(error.response?.data, null, 2)}`);
    }
  };

  const testRegister = async () => {
    try {
      setResult('Testing registration...');
      const response = await authAPI.register(
        'Test User',
        'test@example.com',
        'Test@123',
        '9876543210',
        'User'
      );
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}\nResponse: ${JSON.stringify(error.response?.data, null, 2)}`);
    }
  };

  return (
    <Container>
      <h2>API Connection Test</h2>
      <Button onClick={testLogin}>Test Login (Admin)</Button>
      <Button onClick={testRegister}>Test Registration</Button>
      {result && <Result>{result}</Result>}
    </Container>
  );
};

export default APITest;