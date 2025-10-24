import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { vaccinationsService, petsService } from '../services/api';
import { formatDate, getStatusColor } from '../utils/helpers';
import { VACCINATION_TYPES, VACCINATION_STATUS } from '../utils/constants';
import LoadingSpinner from './LoadingSpinner';

const VaccinationTracker = () => {
  const [vaccinations, setVaccinations] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPet, setSelectedPet] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [completingVax, setCompletingVax] = useState(null);

  const [formData, setFormData] = useState({
    petId: '',
    vaccineName: '',
    type: 'core',
    scheduledDate: '',
    dueDate: '',
    notes: '',
    dosage: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [petsRes, vaxRes] = await Promise.all([
        petsService.getAll(),
        vaccinationsService.getAll()
      ]);
      setPets(petsRes.data.pets || []);
      setVaccinations(vaxRes.data.vaccinations || []);
      
      if (petsRes.data.pets.length > 0) {
        setSelectedPet(petsRes.data.pets[0]._id);
        setFormData(prev => ({ ...prev, petId: petsRes.data.pets[0]._id }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSchedule = async (petId) => {
    try {
      setLoading(true);
      await vaccinationsService.generateSchedule(petId);
      toast.success('Vaccination schedule generated!');
      fetchData();
    } catch (error) {
      console.error('Error generating schedule:', error);
      toast.error('Error generating vaccination schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (vaxId, administeredDate = new Date()) => {
    try {
      await vaccinationsService.complete(vaxId, {
        administeredDate: administeredDate.toISOString()
      });
      toast.success('Vaccination marked as completed!');
      setCompletingVax(null);
      fetchData();
    } catch (error) {
      console.error('Error completing vaccination:', error);
      toast.error('Error updating vaccination');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await vaccinationsService.create(formData);
      toast.success('Vaccination scheduled successfully!');
      setShowForm(false);
      setFormData({
        petId: pets[0]?._id || '',
        vaccineName: '',
        type: 'core',
        scheduledDate: '',
        dueDate: '',
        notes: '',
        dosage: ''
      });
      fetchData();
    } catch (error) {
      console.error('Error creating vaccination:', error);
      toast.error(error.response?.data?.message || 'Error scheduling vaccination');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const filteredVaccinations = selectedPet 
    ? vaccinations.filter(vax => vax.pet?._id === selectedPet)
    : vaccinations;

  const upcomingVaccinations = filteredVaccinations.filter(
    vax => vax.status === 'scheduled' && new Date(vax.dueDate) > new Date()
  );

  const completedVaccinations = filteredVaccinations.filter(
    vax => vax.status === 'completed'
  );

  const overdueVaccinations = filteredVaccinations.filter(
    vax => vax.status === 'scheduled' && new Date(vax.dueDate) < new Date()
  );

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="vaccinations-container">
      <header className="page-header">
        <div>
          <h1>💉 Vaccination Tracker</h1>
          <p>Manage and track your pet's vaccination schedule</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
        >
          + Schedule Vaccination
        </button>
      </header>

      {/* Filters and Actions */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Filter by Pet:</label>
          <select
            value={selectedPet}
            onChange={(e) => setSelectedPet(e.target.value)}
          >
            <option value="">All Pets</option>
            {pets.map(pet => (
              <option key={pet._id} value={pet._id}>
                {pet.name}
              </option>
            ))}
          </select>
        </div>

        {pets.length > 0 && (
          <div className="actions-group">
            <button
              onClick={() => {
                const petId = selectedPet || pets[0]._id;
                handleGenerateSchedule(petId);
              }}
              className="btn btn-secondary"
              disabled={loading}
            >
              Generate Schedule
            </button>
          </div>
        )}
      </div>

      {/* Vaccination Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Schedule New Vaccination</h2>
              <button onClick={() => setShowForm(false)} className="btn-close">×</button>
            </div>

            <form onSubmit={handleSubmit} className="vaccination-form">
              <div className="form-group">
                <label>Pet *</label>
                <select
                  name="petId"
                  value={formData.petId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a pet</option>
                  {pets.map(pet => (
                    <option key={pet._id} value={pet._id}>
                      {pet.name} ({pet.species})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Vaccine Name *</label>
                <input
                  type="text"
                  name="vaccineName"
                  value={formData.vaccineName}
                  onChange={handleChange}
                  required
                  placeholder="Enter vaccine name"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Vaccine Type *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    {VACCINATION_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Dosage</label>
                  <input
                    type="text"
                    name="dosage"
                    value={formData.dosage}
                    onChange={handleChange}
                    placeholder="Dosage amount"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Scheduled Date *</label>
                  <input
                    type="date"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Due Date *</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Additional notes about this vaccination"
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? 'Scheduling...' : 'Schedule Vaccination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complete Vaccination Modal */}
      {completingVax && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Mark Vaccination as Completed</h2>
              <button onClick={() => setCompletingVax(null)} className="btn-close">×</button>
            </div>
            <div className="modal-content">
              <p>Are you sure you want to mark <strong>{completingVax.vaccineName}</strong> for <strong>{completingVax.pet?.name}</strong> as completed?</p>
              <div className="form-actions">
                <button
                  onClick={() => setCompletingVax(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleMarkComplete(completingVax._id)}
                  className="btn btn-primary"
                >
                  Mark Completed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <LoadingSpinner text="Loading vaccinations..." centered />
      ) : (
        <>
          {/* Overdue Vaccinations */}
          {overdueVaccinations.length > 0 && (
            <div className="section urgent-section">
              <h2>⚠️ Overdue Vaccinations</h2>
              <div className="vaccinations-grid">
                {overdueVaccinations.map(vax => (
                  <div key={vax._id} className="vaccination-card overdue">
                    <div className="vax-header">
                      <h3>{vax.vaccineName}</h3>
                      <span className="status-badge status-overdue">
                        Overdue
                      </span>
                    </div>
                    
                    <div className="vax-details">
                      <p><strong>Pet:</strong> {vax.pet?.name}</p>
                      <p><strong>Due Date:</strong> {formatDate(vax.dueDate)}</p>
                      <p><strong>Type:</strong> {vax.type}</p>
                      {vax.notes && <p><strong>Notes:</strong> {vax.notes}</p>}
                    </div>

                    <div className="vax-actions">
                      <button
                        onClick={() => setCompletingVax(vax)}
                        className="btn btn-primary"
                      >
                        Mark Complete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Vaccinations */}
          <div className="section">
            <h2>Upcoming Vaccinations</h2>
            {upcomingVaccinations.length === 0 ? (
              <div className="empty-state">
                <p>No upcoming vaccinations scheduled.</p>
              </div>
            ) : (
              <div className="vaccinations-grid">
                {upcomingVaccinations.map(vax => (
                  <div key={vax._id} className="vaccination-card">
                    <div className="vax-header">
                      <h3>{vax.vaccineName}</h3>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(vax.status) }}
                      >
                        {vax.status}
                      </span>
                    </div>
                    
                    <div className="vax-details">
                      <p><strong>Pet:</strong> {vax.pet?.name}</p>
                      <p><strong>Due Date:</strong> {formatDate(vax.dueDate)}</p>
                      <p><strong>Type:</strong> {vax.type}</p>
                      {vax.notes && <p><strong>Notes:</strong> {vax.notes}</p>}
                    </div>

                    {isOverdue(vax.dueDate) && (
                      <div className="overdue-warning">
                        ⚠️ Overdue
                      </div>
                    )}

                    <div className="vax-actions">
                      <button
                        onClick={() => setCompletingVax(vax)}
                        className="btn btn-primary"
                      >
                        Mark Complete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Vaccinations */}
          <div className="section">
            <h2>Vaccination History</h2>
            {completedVaccinations.length === 0 ? (
              <div className="empty-state">
                <p>No vaccination history yet.</p>
              </div>
            ) : (
              <div className="vaccinations-list">
                {completedVaccinations.map(vax => (
                  <div key={vax._id} className="vaccination-item completed">
                    <div className="vax-info">
                      <h4>{vax.vaccineName}</h4>
                      <p>{vax.pet?.name} • Administered: {formatDate(vax.administeredDate)}</p>
                      {vax.veterinarian?.name && (
                        <p><strong>Veterinarian:</strong> {vax.veterinarian.name}</p>
                      )}
                      {vax.notes && <p><strong>Notes:</strong> {vax.notes}</p>}
                    </div>
                    <span className="status-badge status-completed">
                      Completed
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {pets.length === 0 && !loading && (
        <div className="empty-state">
          <div className="empty-icon">🐕</div>
          <h3>No Pets Found</h3>
          <p>Add a pet first to track vaccinations.</p>
        </div>
      )}
    </div>
  );
};

export default VaccinationTracker;