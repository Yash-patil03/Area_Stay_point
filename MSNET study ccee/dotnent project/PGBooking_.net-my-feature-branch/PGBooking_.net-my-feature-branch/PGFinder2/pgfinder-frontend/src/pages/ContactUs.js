// src/pages/ContactUs.js
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  color: var(--text-main);
  
  h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 800;
  }
  
  p {
    font-size: 1.2rem;
    color: var(--text-light);
    max-width: 600px;
    margin: 0 auto;
  }
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
  justify-content: center;
`;

const MemberCard = styled.div`
  background: var(--surface-color);
  padding: 2.5rem;
  border-radius: var(--radius-xl);
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-lg);
  border: 1px solid rgba(255,255,255,0.5);

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  background: var(--gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  font-weight: bold;
  box-shadow: var(--shadow-glow);
`;

const Name = styled.h3`
  font-size: 1.5rem;
  color: var(--text-main);
  margin-bottom: 0.5rem;
`;

const Role = styled.p`
  color: var(--primary);
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Bio = styled.p`
  color: var(--text-light);
  font-size: 0.95rem;
  line-height: 1.6;
`;

const ContactUs = () => {
  const team = [
    {
      name: 'Shamal Bhujbal',
      role: 'Project Lead & Full Stack Developer',
      initials: 'SB',
      description: 'Leading the development of PG Finder with expertise in full-stack technologies and architectural design.'
    },
    {
      name: 'Afsha Khan',
      role: 'Developer / Team Member',
      initials: 'AK',
      description: 'Contributing to frontend interfaces and ensuring a seamless user experience.'
    },
    {
      name: 'Yash Patil',
      role: 'Developer / Team Member',
      initials: 'YP',
      description: 'Focused on backend logic, database management, and API integration.'
    },
    {
      name: 'Siddhi Adkitte',
      role: 'Developer / Team Member',
      initials: 'SA',
      description: 'Working on UI/UX design and component development.'
    },
    {
      name: 'Akash Kokulwar',
      role: 'Developer / Team Member',
      initials: 'AK',
      description: 'Assisting with testing, quality assurance, and feature implementation.'
    }
  ];

  return (
    <Container>
      <Header>
        <h1>Meet Our Team</h1>
        <p>The talented individuals behind PG Finder, working together to simplify your accommodation search.</p>
      </Header>

      <TeamGrid>
        {team.map((member, index) => (
          <MemberCard key={index}>
            <Avatar>{member.initials}</Avatar>
            <Name>{member.name}</Name>
            <Role>{member.role}</Role>
            <Bio>{member.description}</Bio>
          </MemberCard>
        ))}
      </TeamGrid>
    </Container>
  );
};

export default ContactUs;
