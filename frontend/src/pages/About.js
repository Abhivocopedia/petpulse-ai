import React from 'react';

const About = () => {
  const features = [
    {
      title: "AI-Powered Health Analysis",
      description: "Get instant, intelligent analysis of your pet's symptoms with our advanced AI technology."
    },
    {
      title: "Comprehensive Vaccination Tracking",
      description: "Never miss a vaccination with smart scheduling, automatic reminders, and digital records."
    },
    {
      title: "Behavior Problem Solutions",
      description: "Expert-guided solutions for common behavior issues with step-by-step training plans."
    },
    {
      title: "Complete Pet Profiles",
      description: "Store all your pet's information in one secure, accessible location."
    }
  ];

  const team = [
    {
      name: "Dr. Sarah Johnson",
      role: "Veterinary Advisor",
      bio: "Licensed veterinarian with 15+ years of experience in pet healthcare."
    },
    {
      name: "Mike Chen",
      role: "AI Specialist",
      bio: "Machine learning expert focused on pet health pattern recognition."
    },
    {
      name: "Emily Rodriguez",
      role: "Animal Behaviorist",
      bio: "Certified animal behavior consultant with expertise in training solutions."
    }
  ];

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-content">
            <h1>About PetPulse AI</h1>
            <p className="hero-subtitle">
              Revolutionizing pet healthcare through intelligent technology and expert knowledge
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <h2>Our Mission</h2>
            <p>
              At PetPulse AI, we believe every pet deserves the best possible care. 
              Our mission is to empower pet owners with intelligent tools and expert 
              knowledge to make informed decisions about their pet's health and wellbeing.
            </p>
            <p>
              We combine advanced AI technology with veterinary expertise to provide 
              personalized health insights, proactive care recommendations, and 
              immediate support when you need it most.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Why Choose PetPulse AI?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2>Our Expert Team</h2>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-card">
                <div className="member-avatar">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3>{member.name}</h3>
                <p className="member-role">{member.role}</p>
                <p className="member-bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>10,000+</h3>
              <p>Happy Pets</p>
            </div>
            <div className="stat-item">
              <h3>99.8%</h3>
              <p>Accuracy Rate</p>
            </div>
            <div className="stat-item">
              <h3>24/7</h3>
              <p>Available Support</p>
            </div>
            <div className="stat-item">
              <h3>50+</h3>
              <p>Veterinary Partners</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Give Your Pet the Best Care?</h2>
            <p>Join thousands of pet owners who trust PetPulse AI for their pet's health management.</p>
            <div className="cta-buttons">
              <a href="/register" className="btn btn-primary btn-large">
                Get Started Free
              </a>
              <a href="/contact" className="btn btn-outline btn-large">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;