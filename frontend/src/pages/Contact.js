import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success('Thank you for your message! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setLoading(false);
    }, 2000);
  };

  const contactMethods = [
    {
      icon: '📧',
      title: 'Email Us',
      details: 'support@petpulse.ai',
      description: 'Send us an email anytime'
    },
    {
      icon: '📞',
      title: 'Call Us',
      details: '+1 (555) 123-4567',
      description: 'Mon to Fri: 9am to 6pm'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      details: 'Available 24/7',
      description: 'Get instant help from our team'
    },
    {
      icon: '📍',
      title: 'Visit Us',
      details: '123 Pet Care Ave, City',
      description: 'Feel free to visit our office'
    }
  ];

  const faqs = [
    {
      question: 'How accurate is the symptom checker?',
      answer: 'Our AI symptom checker has a 99.8% accuracy rate for common pet health issues. However, it should not replace professional veterinary diagnosis.'
    },
    {
      question: 'Is my pet data secure?',
      answer: 'Yes, we use enterprise-grade security and encryption to protect all your pet health information.'
    },
    {
      question: 'Can I use this for multiple pets?',
      answer: 'Absolutely! You can manage unlimited pet profiles with individual health records and vaccination schedules.'
    },
    {
      question: 'Is there a mobile app?',
      answer: 'Currently, our web app is fully responsive and works perfectly on mobile devices. A native mobile app is coming soon.'
    }
  ];

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Contact Us</h1>
            <p>We're here to help you and your pets. Get in touch with our team.</p>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="contact-content">
          {/* Contact Methods */}
          <section className="contact-methods">
            <h2>Get in Touch</h2>
            <div className="methods-grid">
              {contactMethods.map((method, index) => (
                <div key={index} className="method-card">
                  <div className="method-icon">{method.icon}</div>
                  <h3>{method.title}</h3>
                  <p className="method-details">{method.details}</p>
                  <p className="method-description">{method.description}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="contact-layout">
            {/* Contact Form */}
            <section className="contact-form-section">
              <h2>Send us a Message</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What is this regarding?"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Tell us how we can help you and your pet..."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-large"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </section>

            {/* FAQ Section */}
            <section className="faq-section">
              <h2>Frequently Asked Questions</h2>
              <div className="faq-list">
                {faqs.map((faq, index) => (
                  <div key={index} className="faq-item">
                    <h3>{faq.question}</h3>
                    <p>{faq.answer}</p>
                  </div>
                ))}
              </div>

              {/* Additional Info */}
              <div className="additional-info">
                <h3>Need Immediate Help?</h3>
                <p>
                  If your pet is experiencing a medical emergency, please contact 
                  your local emergency veterinary clinic immediately.
                </p>
                <div className="emergency-contacts">
                  <strong>Emergency Resources:</strong>
                  <ul>
                    <li>Local Emergency Vet: Check your local directory</li>
                    <li>Animal Poison Control: (888) 426-4435</li>
                    <li>Pet Emergency Hotline: (855) 764-7661</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;