import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HeroContainer = styled.div`
  min-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  background: var(--bg-color);
`;

const HeroContent = styled.div`
  max-width: 800px;
  padding: 2rem;
  z-index: 2;
  animation: fadeIn 0.8s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 1.5rem;
  line-height: 1.2;
  letter-spacing: -0.02em;

  span {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: var(--text-light);
  margin-bottom: 3rem;
  line-height: 1.6;
`;

const Button = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-primary);
  color: white;
  padding: 1rem 2.5rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  box-shadow: var(--shadow-glow);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(14, 165, 233, 0.4);
    filter: brightness(1.1);
    color: white;
  }
`;

const BackgroundBlob = styled.div`
  position: absolute;
  filter: blur(80px);
  opacity: 0.4;
  z-index: 1;
`;

const Blob1 = styled(BackgroundBlob)`
  top: -10%;
  left: -10%;
  width: 600px;
  height: 600px;
  background: rgba(56, 189, 248, 0.3); /* Sky 400 */
  border-radius: 50%;
  mix-blend-mode: multiply;
`;

const Blob2 = styled(BackgroundBlob)`
  bottom: -10%;
  right: -10%;
  width: 600px;
  height: 600px;
  background: rgba(20, 184, 166, 0.2); /* Teal 500 */
  border-radius: 50%;
  mix-blend-mode: multiply;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 4rem auto;
  padding: 0 2rem;
`;

const FeatureCard = styled.div`
  background: var(--surface-color);
  padding: 2.5rem;
  border-radius: var(--radius-xl);
  text-align: center;
  box-shadow: var(--shadow-lg);
  transition: all 0.3s ease;
  border: 1px solid rgba(255,255,255,0.5);

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  h3 {
    margin: 1.5rem 0 1rem;
    color: var(--text-main);
    font-size: 1.25rem;
    font-weight: 700;
  }

  p {
    color: var(--text-light);
    font-size: 1rem;
    line-height: 1.6;
  }
  
  .icon {
    font-size: 3rem;
    margin-bottom: 1.5rem;
    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
  }
`;

const Home = () => {
  return (
    <div>
      <HeroContainer>
        <Blob1 />
        <Blob2 />
        <HeroContent>
          <Title>Discover Your Next <br /><span>Home comfort</span></Title>
          <Subtitle>
            Seamlessly find and book premium paying guest accommodations across the city.
            No brokerage, verified listings, and instant bookings.
          </Subtitle>
          <Button to="/pgs">Explore Properties Now</Button>
        </HeroContent>
      </HeroContainer>

      <FeatureGrid>
        <FeatureCard>
          <div className="icon">📍</div>
          <h3>Prime Locations</h3>
          <p>Find PGs in the heart of the city, close to your workplace or college.</p>
        </FeatureCard>
        <FeatureCard>
          <div className="icon">🛡️</div>
          <h3>Verified Listings</h3>
          <p>Every property is physically verified to ensure you get exactly what you see.</p>
        </FeatureCard>
        <FeatureCard>
          <div className="icon">💳</div>
          <h3>Secure Booking</h3>
          <p>Book online instantly with our secure payment gateway and instant confirmation.</p>
        </FeatureCard>
      </FeatureGrid>
    </div>
  );
};

export default Home;
