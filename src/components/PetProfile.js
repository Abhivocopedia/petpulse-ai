import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { petsService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getSpeciesEmoji, formatAge, formatWeight } from '../utils/helpers';
import { PET_SPECIES, GENDER_OPTIONS, WEIGHT_UNITS } from '../utils/constants';
import LoadingSpinner from './LoadingSpinner';

const PetProfile = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [breeds, setBreeds] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    species: 'dog',
    breed: '',
    age: { years: 0, months: 0 },
    weight: { value: 0, unit: 'kg' },
    gender: '',
    location: '',
    color: '',
    birthDate: '',
    microchipId: '',
    insuranceInfo: { provider: '', policyNumber: '' },
    vetInfo: { name: '', clinic: '', phone: '', address: '' },
    medicalConditions: [],
    allergies: [],
    dietaryRestrictions: []
  });

  useEffect(() => {
    fetchPets();
  }, []);

  useEffect(() => {
    if (formData.species) {
      fetchBreeds(formData.species);
    }
  }, [formData.species]);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const response = await petsService.getAll();
      setPets(response.data.pets || []);
    } catch (error) {
      console.error('Error fetching pets:', error);
      toast.error('Error loading pets');
    } finally {
      setLoading(false);
    }
  };

  const fetchBreeds = async (species) => {
    try {
      const response = await petsService.getBreeds(species);
      setBreeds(response.data.breeds || []);
    } catch (error) {
      console.error('Error fetching breeds:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingPet) {
        await petsService.update(editingPet._id, formData);
        toast.success('Pet updated successfully!');
      } else {
        await petsService.create(formData);
        toast.success('Pet added successfully!');
      }

      setShowForm(false);
      setEditingPet(null);
      resetForm();
      fetchPets();
    } catch (error) {
      console.error('Error saving pet:', error);
      toast.error(error.response?.data?.message || 'Error saving pet');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pet) => {
    setEditingPet(pet);
    setFormData({
      ...pet,
      birthDate: pet.birthDate ? pet.birthDate.split('T')[0] : ''
    });
    setShowForm(true);
  };

  const handleDelete = async (petId) => {
    if (window.confirm('Are you sure you want to delete this pet? This action cannot be undone.')) {
      try {
        await petsService.delete(petId);
        toast.success('Pet deleted successfully');
        fetchPets();
      } catch (error) {
        console.error('Error deleting pet:', error);
        toast.error('Error deleting pet');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      species: 'dog',
      breed: '',
      age: { years: 0, months: 0 },
      weight: { value: 0, unit: 'kg' },
      gender: '',
      location: '',
      color: '',
      birthDate: '',
      microchipId: '',
      insuranceInfo: { provider: '', policyNumber: '' },
      vetInfo: { name: '', clinic: '', phone: '', address: '' },
      medicalConditions: [],
      allergies: [],
      dietaryRestrictions: []
    });
  };

  const addMedicalCondition = () => {
    setFormData(prev => ({
      ...prev,
      medicalConditions: [
        ...prev.medicalConditions,
        { condition: '', diagnosed: '', notes: '', severity: 'moderate' }
      ]
    }));
  };

  const updateMedicalCondition = (index, field, value) => {
    setFormData(prev => {
      const updatedConditions = [...prev.medicalConditions];
      updatedConditions[index][field] = value;
      return { ...prev, medicalConditions: updatedConditions };
    });
  };

  const removeMedicalCondition = (index) => {
    setFormData(prev => ({
      ...prev,
      medicalConditions: prev.medicalConditions.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="pets-container">
      <header className="page-header">
        <div>
          <h1>🐕 Pet Profiles</h1>
          <p>Manage your pet information and health records</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
        >
          + Add New Pet
        </button>
      </header>

      {/* Pet Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingPet ? 'Edit Pet' : 'Add New Pet'}</h2>
              <button onClick={() => { setShowForm(false); setEditingPet(null); resetForm(); }} className="btn-close">×</button>
            </div>

            <form onSubmit={handleSubmit} className="pet-form">
              <div className="form-section">
                <h3>Basic Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter pet name"
                    />
                  </div>

                  <div className="form-group">
                    <label>Species *</label>
                    <select
                      name="species"
                      value={formData.species}
                      onChange={handleChange}
                      required
                    >
                      {PET_SPECIES.map(species => (
                        <option key={species.value} value={species.value}>
                          {species.emoji} {species.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Breed *</label>
                    <input
                      type="text"
                      name="breed"
                      value={formData.breed}
                      onChange={handleChange}
                      required
                      placeholder="Enter breed"
                      list="breeds"
                    />
                    <datalist id="breeds">
                      {breeds.map(breed => (
                        <option key={breed.name} value={breed.name} />
                      ))}
                    </datalist>
                  </div>

                  <div className="form-group">
                    <label>Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select Gender</option>
                      {GENDER_OPTIONS.map(gender => (
                        <option key={gender.value} value={gender.value}>
                          {gender.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Age (Years)</label>
                    <input
                      type="number"
                      name="age.years"
                      value={formData.age.years}
                      onChange={handleChange}
                      min="0"
                      max="50"
                    />
                  </div>

                  <div className="form-group">
                    <label>Age (Months)</label>
                    <input
                      type="number"
                      name="age.months"
                      value={formData.age.months}
                      onChange={handleChange}
                      min="0"
                      max="11"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Weight</label>
                    <input
                      type="number"
                      name="weight.value"
                      value={formData.weight.value}
                      onChange={handleChange}
                      min="0"
                      step="0.1"
                      placeholder="Weight value"
                    />
                  </div>

                  <div className="form-group">
                    <label>Unit</label>
                    <select
                      name="weight.unit"
                      value={formData.weight.unit}
                      onChange={handleChange}
                    >
                      {WEIGHT_UNITS.map(unit => (
                        <option key={unit.value} value={unit.value}>
                          {unit.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Color</label>
                    <input
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      placeholder="Pet color"
                    />
                  </div>

                  <div className="form-group">
                    <label>Birth Date</label>
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Where does your pet live?"
                  />
                </div>

                <div className="form-group">
                  <label>Microchip ID</label>
                  <input
                    type="text"
                    name="microchipId"
                    value={formData.microchipId}
                    onChange={handleChange}
                    placeholder="Microchip identification number"
                  />
                </div>
              </div>

              {/* Medical Conditions */}
              <div className="form-section">
                <div className="section-header">
                  <h3>Medical Conditions</h3>
                  <button type="button" onClick={addMedicalCondition} className="btn btn-outline btn-small">
                    + Add Condition
                  </button>
                </div>
                
                {formData.medicalConditions.map((condition, index) => (
                  <div key={index} className="condition-item">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Condition</label>
                        <input
                          type="text"
                          value={condition.condition}
                          onChange={(e) => updateMedicalCondition(index, 'condition', e.target.value)}
                          placeholder="Medical condition"
                        />
                      </div>
                      <div className="form-group">
                        <label>Diagnosed</label>
                        <input
                          type="date"
                          value={condition.diagnosed}
                          onChange={(e) => updateMedicalCondition(index, 'diagnosed', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Severity</label>
                        <select
                          value={condition.severity}
                          onChange={(e) => updateMedicalCondition(index, 'severity', e.target.value)}
                        >
                          <option value="mild">Mild</option>
                          <option value="moderate">Moderate</option>
                          <option value="severe">Severe</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>&nbsp;</label>
                        <button
                          type="button"
                          onClick={() => removeMedicalCondition(index)}
                          className="btn btn-danger btn-small"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Notes</label>
                      <textarea
                        value={condition.notes}
                        onChange={(e) => updateMedicalCondition(index, 'notes', e.target.value)}
                        placeholder="Additional notes about this condition"
                        rows="2"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Vet Information */}
              <div className="form-section">
                <h3>Veterinarian Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Vet Name</label>
                    <input
                      type="text"
                      name="vetInfo.name"
                      value={formData.vetInfo.name}
                      onChange={handleChange}
                      placeholder="Veterinarian name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Clinic</label>
                    <input
                      type="text"
                      name="vetInfo.clinic"
                      value={formData.vetInfo.clinic}
                      onChange={handleChange}
                      placeholder="Clinic name"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="vetInfo.phone"
                      value={formData.vetInfo.phone}
                      onChange={handleChange}
                      placeholder="Clinic phone number"
                    />
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      name="vetInfo.address"
                      value={formData.vetInfo.address}
                      onChange={handleChange}
                      placeholder="Clinic address"
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingPet(null); resetForm(); }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? 'Saving...' : (editingPet ? 'Update Pet' : 'Add Pet')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pets Grid */}
      {loading && pets.length === 0 ? (
        <LoadingSpinner text="Loading pets..." centered />
      ) : (
        <div className="pets-grid">
          {pets.map(pet => (
            <div key={pet._id} className="pet-profile-card">
              <div className="pet-header">
                <div className="pet-avatar">
                  {getSpeciesEmoji(pet.species)}
                </div>
                <div className="pet-info">
                  <h3>{pet.name}</h3>
                  <p>{pet.breed} • {pet.species}</p>
                  <span className="pet-age">{formatAge(pet.age)}</span>
                </div>
              </div>

              <div className="pet-details">
                <div className="detail-item">
                  <span>Gender:</span>
                  <span>{pet.gender || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span>Weight:</span>
                  <span>{formatWeight(pet.weight)}</span>
                </div>
                {pet.color && (
                  <div className="detail-item">
                    <span>Color:</span>
                    <span>{pet.color}</span>
                  </div>
                )}
                {pet.location && (
                  <div className="detail-item">
                    <span>Location:</span>
                    <span>{pet.location}</span>
                  </div>
                )}
                {pet.medicalConditions.length > 0 && (
                  <div className="detail-item">
                    <span>Medical Conditions:</span>
                    <span>{pet.medicalConditions.length}</span>
                  </div>
                )}
              </div>

              <div className="pet-actions">
                <button
                  onClick={() => handleEdit(pet)}
                  className="btn btn-secondary"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(pet._id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pets.length === 0 && !loading && (
        <div className="empty-state">
          <div className="empty-icon">🐾</div>
          <h3>No Pets Added Yet</h3>
          <p>Start by adding your first pet to track their health and vaccinations.</p>
          <button 
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            Add Your First Pet
          </button>
        </div>
      )}
    </div>
  );
};

export default PetProfile;