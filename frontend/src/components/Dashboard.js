import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { petsService, vaccinationsService, healthService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatDate, getSpeciesEmoji, getUrgencyColor } from '../utils/helpers';
import LoadingSpinner from './LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [vaccinations, setVaccinations] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPets: 0,
    upcomingVaccinations: 0,
    recentHealthRecords: 0,
    urgentIssues: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [petsRes, vaxRes, healthRes] = await Promise.all([
        petsService.getAll(),
        vaccinationsService.getAll(),
        healthService.getRecords()
      ]);

      setPets(petsRes.data.pets || []);
      setVaccinations(vaxRes.data.vaccinations || []);
      setHealthRecords(healthRes.data.records || []);

      // Calculate stats
      const upcomingVax = vaxRes.data.vaccinations.filter(vax => 
        vax.status === 'scheduled' && new Date(vax.dueDate) > new Date()
      ).length;

      const urgentIssues = healthRes.data.records.filter(record => 
        record.urgency === 'emergency' || record.urgency === 'urgent'
      ).length;

      setStats({
        totalPets: petsRes.data.pets.length,
        upcomingVaccinations: upcomingVax,
        recentHealthRecords: healthRes.data.records.length,
        urgentIssues
      });

    } catch (error) {
      console.error('Dashboard data error:', error);
      toast.error('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const upcomingVaccinations = vaccinations
    .filter(vax => vax.status === 'scheduled' && new Date(vax.dueDate) > new Date())
    .slice(0, 5);

  const recentHealthRecords = healthRecords.slice(0, 5);

  if (loading) {
    return <LoadingSpinner text="Loading your dashboard..." centered />;
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🐾 Welcome back, {user?.firstName}!</h1>
          <p>Here's your pet health overview</p>
        </div>
        <div className="header-actions">
          <Link to="/pets" className="btn btn-primary">
            Manage Pets
          </Link>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🐕</div>
          <div className="stat-info">
            <h3>{stats.totalPets}</h3>
            <p>Total Pets</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💉</div>
          <div className="stat-info">
            <h3>{stats.upcomingVaccinations}</h3>
            <p>Upcoming Vaccinations</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏥</div>
          <div className="stat-info">
            <h3>{stats.recentHealthRecords}</h3>
            <p>Health Records</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <h3>{stats.urgentIssues}</h3>
            <p>Urgent Issues</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/pets" className="action-card">
            <div className="action-icon">🐶</div>
            <h3>Manage Pets</h3>
            <p>Add or edit pet profiles</p>
          </Link>

          <Link to="/vaccinations" className="action-card">
            <div className="action-icon">💉</div>
            <h3>Vaccinations</h3>
            <p>Track vaccination schedules</p>
          </Link>

          <Link to="/symptom-checker" className="action-card">
            <div className="action-icon">🔍</div>
            <h3>Symptom Checker</h3>
            <p>AI-powered health analysis</p>
          </Link>

          <Link to="/behavior-solver" className="action-card">
            <div className="action-icon">🎯</div>
            <h3>Behavior Solver</h3>
            <p>Solve behavior problems</p>
          </Link>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Recent Pets */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Your Pets</h2>
            <Link to="/pets" className="btn-link">View All</Link>
          </div>
          {pets.length === 0 ? (
            <div className="empty-state">
              <p>No pets added yet.</p>
              <Link to="/pets" className="btn btn-primary">Add Your First Pet</Link>
            </div>
          ) : (
            <div className="pets-grid">
              {pets.slice(0, 4).map(pet => (
                <div key={pet._id} className="pet-card">
                  <div className="pet-avatar">
                    {getSpeciesEmoji(pet.species)}
                  </div>
                  <h3>{pet.name}</h3>
                  <p>{pet.breed} • {pet.species}</p>
                  <p>Age: {pet.age?.years || 0}y {pet.age?.months || 0}m</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Vaccinations */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Upcoming Vaccinations</h2>
            <Link to="/vaccinations" className="btn-link">View All</Link>
          </div>
          {upcomingVaccinations.length === 0 ? (
            <div className="empty-state">
              <p>No upcoming vaccinations.</p>
            </div>
          ) : (
            <div className="vaccination-list">
              {upcomingVaccinations.map(vax => (
                <div key={vax._id} className="vaccination-item">
                  <div className="vax-info">
                    <h4>{vax.vaccineName}</h4>
                    <p>{vax.pet?.name} • Due: {formatDate(vax.dueDate)}</p>
                  </div>
                  <span className={`status-badge status-${vax.status}`}>
                    {vax.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Health Records */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Health Records</h2>
            <Link to="/symptom-checker" className="btn-link">Check Symptoms</Link>
          </div>
          {recentHealthRecords.length === 0 ? (
            <div className="empty-state">
              <p>No health records yet.</p>
            </div>
          ) : (
            <div className="health-records">
              {recentHealthRecords.map(record => (
                <div key={record._id} className="health-record">
                  <div className="record-header">
                    <h4>{record.title}</h4>
                    <span 
                      className="urgency-badge"
                      style={{ backgroundColor: getUrgencyColor(record.urgency) }}
                    >
                      {record.urgency}
                    </span>
                  </div>
                  <p>{record.pet?.name} • {formatDate(record.createdAt)}</p>
                  <p className="record-description">
                    {record.description?.substring(0, 100)}
                    {record.description?.length > 100 ? '...' : ''}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Tips */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Pet Care Tips</h2>
          </div>
          <div className="tips-list">
            <div className="tip-item">
              <span className="tip-icon">💧</span>
              <p>Ensure fresh water is available at all times</p>
            </div>
            <div className="tip-item">
              <span className="tip-icon">🥕</span>
              <p>Provide balanced nutrition appropriate for your pet's age and species</p>
            </div>
            <div className="tip-item">
              <span className="tip-icon">🏃‍♂️</span>
              <p>Regular exercise is essential for physical and mental health</p>
            </div>
            <div className="tip-item">
              <span className="tip-icon">🩺</span>
              <p>Schedule regular veterinary check-ups for preventive care</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;