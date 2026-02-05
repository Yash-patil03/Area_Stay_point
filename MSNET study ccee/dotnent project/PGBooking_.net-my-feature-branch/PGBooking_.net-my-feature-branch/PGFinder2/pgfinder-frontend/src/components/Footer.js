// src/components/Footer.js
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer`
  background: var(--text-main);
  color: var(--bg-color);
  padding: 4rem 2rem 2rem;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const Section = styled.div`
  h3 {
    color: var(--surface-color);
    margin-bottom: 1.2rem;
    font-size: 1.1rem;
    font-weight: 700;
  }
`;

const LinkList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  
  li {
    margin-bottom: 0.8rem;
  }
  
  a {
    color: #94a3b8;
    text-decoration: none;
    transition: color 0.2s;
    
    &:hover {
      color: var(--primary-light);
    }
  }
`;

const Brand = styled.div`
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--surface-color);
`;

const Description = styled.p`
  color: #94a3b8;
  line-height: 1.6;
`;

const CopyRight = styled.div`
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 1.5rem;
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <Section>
          <Brand>PG Finder</Brand>
          <Description>
            Helping you find the perfect home away from home.
            Secure bookings, verified listings, and a seamless experience.
          </Description>
        </Section>

        <Section>
          <h3>Quick Links</h3>
          <LinkList>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/pgs">Find PGs</Link></li>
            <li><Link to="/bookings">My Bookings</Link></li>
          </LinkList>
        </Section>

        <Section>
          <h3>Support</h3>
          <LinkList>
            <li><Link to="/#">Help Center</Link></li>
            <li><Link to="/#">Safety Guidelines</Link></li>
            <li><Link to="/#">Terms & Conditions</Link></li>
            <li><Link to="/#">Privacy Policy</Link></li>
          </LinkList>
        </Section>

        <Section>
          <h3>Contact Us</h3>
          <LinkList>
            <li><Link to="/contact">Meet The Team</Link></li>
            <li><a href="mailto:support@pgfinder.com">support@pgfinder.com</a></li>
            <li><a href="tel:+919876543210">+91 98765 43210</a></li>
            <li>Mumbai, Maharashtra, India</li>
          </LinkList>
        </Section>
      </FooterContent>

      <CopyRight>
        © {new Date().getFullYear()} PG Finder. All rights reserved.
      </CopyRight>
    </FooterContainer>
  );
};

export default Footer;
