import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  color: white;
  text-align: center;
  margin-bottom: 2rem;
`;

const Donation = () => {
    return (
        <Container>
            <Title>Donation</Title>
            <p style={{ color: 'white', textAlign: 'center' }}>Donation functionality coming soon...</p>
        </Container>
    );
};

export default Donation;
