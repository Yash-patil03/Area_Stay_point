import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';

const HomeContainer = styled.div`
  min-height: 100vh;
  overflow-x: hidden;
`;

const HeroSection = styled.section`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%),
              url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');
  background-size: cover;
  background-position: center;
  color: white;
`;

const HeroContent = styled.div`
  max-width: 800px;
  padding: 2rem;
  z-index: 2;
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.3);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`;

const FeaturesSection = styled.section`
  padding: 5rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 3rem;
  color: white;
  margin-bottom: 3rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

const PGShowcase = styled.section`
  padding: 5rem 2rem;
  background: rgba(255, 255, 255, 0.05);
`;

const ShowcaseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const PGCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
  }
`;

const PGImage = styled.div`
  height: 250px;
  background-image: url('${props => props.image}');
  background-size: cover;
  background-position: center;
  position: relative;
`;

const PGBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(102, 126, 234, 0.9);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
`;

const PGContent = styled.div`
  padding: 1.5rem;
`;

const PGName = styled.h3`
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const PGLocation = styled.p`
  color: #666;
  margin-bottom: 1rem;
`;

const PGPrice = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
`;

const Home = () => {
  const { isAuthenticated } = useAuth();

  const samplePGs = [
    {
      id: 1,
      name: "Luxury PG Andheri",
      location: "Andheri East, Mumbai",
      price: "₹12,000",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      badge: "Premium"
    },
    {
      id: 2,
      name: "Student Hub Powai",
      location: "Powai, Mumbai",
      price: "₹8,500",
      image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
      badge: "Popular"
    },
    {
      id: 3,
      name: "Executive Stay Bandra",
      location: "Bandra West, Mumbai",
      price: "₹15,000",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80",
      badge: "Executive"
    }
  ];

  return (
    <HomeContainer>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Find Your Perfect PG</HeroTitle>
          <HeroSubtitle>
            Discover comfortable, affordable, and safe PG accommodations in Mumbai
          </HeroSubtitle>
          <CTAButton to={isAuthenticated ? "/pgs" : "/register"}>
            {isAuthenticated ? "Browse PGs" : "Get Started"}
          </CTAButton>
        </HeroContent>
      </HeroSection>

      <FeaturesSection>
        <SectionTitle>Why Choose PG Finder?</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>🏠</FeatureIcon>
            <FeatureTitle>Verified Properties</FeatureTitle>
            <FeatureDescription>
              All PG accommodations are verified and inspected for quality and safety standards.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>💰</FeatureIcon>
            <FeatureTitle>Best Prices</FeatureTitle>
            <FeatureDescription>
              Compare prices and find the most affordable PG options that fit your budget.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>📱</FeatureIcon>
            <FeatureTitle>Easy Booking</FeatureTitle>
            <FeatureDescription>
              Book your PG accommodation online with our simple and secure booking process.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🔒</FeatureIcon>
            <FeatureTitle>Secure Payments</FeatureTitle>
            <FeatureDescription>
              Safe and secure payment gateway with multiple payment options available.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>⭐</FeatureIcon>
            <FeatureTitle>Real Reviews</FeatureTitle>
            <FeatureDescription>
              Read genuine reviews from previous tenants to make informed decisions.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>🎯</FeatureIcon>
            <FeatureTitle>Perfect Match</FeatureTitle>
            <FeatureDescription>
              Advanced filters to find PGs that match your preferences and requirements.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      <PGShowcase>
        <SectionTitle>Featured PG Accommodations</SectionTitle>
        <ShowcaseGrid>
          {samplePGs.map(pg => (
            <PGCard key={pg.id}>
              <PGImage image={pg.image}>
                <PGBadge>{pg.badge}</PGBadge>
              </PGImage>
              <PGContent>
                <PGName>{pg.name}</PGName>
                <PGLocation>{pg.location}</PGLocation>
                <PGPrice>{pg.price}/month</PGPrice>
              </PGContent>
            </PGCard>
          ))}
        </ShowcaseGrid>
      </PGShowcase>
    </HomeContainer>
  );
};

export default Home;