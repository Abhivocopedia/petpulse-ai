import React, { useState, useEffect } from 'react';
import { petsService } from '../services/api';
import { PET_SPECIES } from '../utils/constants';
import LoadingSpinner from './LoadingSpinner';

const BreedInfo = () => {
  const [breeds, setBreeds] = useState({});
  const [selectedSpecies, setSelectedSpecies] = useState('dog');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBreeds(selectedSpecies);
  }, [selectedSpecies]);

  const fetchBreeds = async (species) => {
    setLoading(true);
    try {
      const response = await petsService.getBreeds(species);
      setBreeds(prev => ({
        ...prev,
        [species]: response.data.breeds || []
      }));
    } catch (error) {
      console.error('Error fetching breeds:', error);
      setBreeds(prev => ({
        ...prev,
        [species]: []
      }));
    } finally {
      setLoading(false);
    }
  };

  const currentBreeds = breeds[selectedSpecies] || [];

  const filteredBreeds = currentBreeds.filter(breed =>
    breed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    breed.temperament?.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
    breed.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSizeColor = (size) => {
    switch (size) {
      case 'small': return '#28a745';
      case 'medium': return '#ffc107';
      case 'large': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getExerciseColor = (level) => {
    switch (level) {
      case 'low': return '#28a745';
      case 'moderate': return '#ffc107';
      case 'high': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getGroomingColor = (level) => {
    switch (level) {
      case 'low': return '#28a745';
      case 'moderate': return '#ffc107';
      case 'high': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getCareLevelColor = (level) => {
    switch (level) {
      case 'low': return '#28a745';
      case 'moderate': return '#ffc107';
      case 'high': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div className="breed-info-container">
      <header className="page-header">
        <div>
          <h1>📚 Breed Information</h1>
          <p>Learn about different pet breeds and their characteristics</p>
        </div>
      </header>

      {/* Species Selection */}
      <div className="species-selector">
        {PET_SPECIES.map(species => (
          <button
            key={species.value}
            onClick={() => setSelectedSpecies(species.value)}
            className={`species-btn ${selectedSpecies === species.value ? 'active' : ''}`}
          >
            <span className="species-emoji">{species.emoji}</span>
            <span>{species.label}</span>
          </button>
        ))}
      </div>

      {/* Search Box */}
      <div className="search-section">
        <div className="search-box">
          <input
            type="text"
            placeholder={`Search ${selectedSpecies} breeds...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="breeds-count">
          {filteredBreeds.length} {selectedSpecies} breeds found
          {searchTerm && ` for "${searchTerm}"`}
        </div>
      </div>

      {/* Breeds Grid */}
      {loading ? (
        <LoadingSpinner text={`Loading ${selectedSpecies} breed information...`} centered />
      ) : (
        <div className="breeds-grid">
          {filteredBreeds.map(breed => (
            <div key={breed.name} className="breed-card">
              <div className="breed-header">
                <h3>{breed.name}</h3>
                <div className="breed-meta">
                  {breed.size && (
                    <span 
                      className="meta-tag"
                      style={{ backgroundColor: getSizeColor(breed.size) }}
                    >
                      {breed.size}
                    </span>
                  )}
                  {breed.lifespan && (
                    <span className="meta-tag lifespan">
                      {breed.lifespan}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              {breed.description && (
                <div className="breed-description">
                  <p>{breed.description}</p>
                </div>
              )}

              {/* Origin and Group */}
              <div className="breed-origin">
                {breed.origin && (
                  <div className="origin-item">
                    <strong>Origin:</strong> {breed.origin}
                  </div>
                )}
                {breed.group && (
                  <div className="origin-item">
                    <strong>Group:</strong> {breed.group}
                  </div>
                )}
              </div>

              {/* Temperament */}
              {breed.temperament && (
                <div className="breed-section">
                  <h4>Personality</h4>
                  <div className="temperament-tags">
                    {breed.temperament.map(trait => (
                      <span key={trait} className="trait-tag">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Care Requirements */}
              <div className="care-requirements">
                <h4>Care Requirements</h4>
                {breed.exerciseNeeds && (
                  <div className="care-item">
                    <span className="care-label">Exercise:</span>
                    <span 
                      className="care-value"
                      style={{ color: getExerciseColor(breed.exerciseNeeds) }}
                    >
                      {breed.exerciseNeeds}
                    </span>
                  </div>
                )}

                {breed.groomingNeeds && (
                  <div className="care-item">
                    <span className="care-label">Grooming:</span>
                    <span 
                      className="care-value"
                      style={{ color: getGroomingColor(breed.groomingNeeds) }}
                    >
                      {breed.groomingNeeds}
                    </span>
                  </div>
                )}

                {breed.careLevel && (
                  <div className="care-item">
                    <span className="care-label">Care Level:</span>
                    <span 
                      className="care-value"
                      style={{ color: getCareLevelColor(breed.careLevel) }}
                    >
                      {breed.careLevel}
                    </span>
                  </div>
                )}

                {breed.shedding && (
                  <div className="care-item">
                    <span className="care-label">Shedding:</span>
                    <span className="care-value">{breed.shedding}</span>
                  </div>
                )}

                {breed.trainability && (
                  <div className="care-item">
                    <span className="care-label">Trainability:</span>
                    <span className="care-value">{breed.trainability}</span>
                  </div>
                )}

                {breed.energyLevel && (
                  <div className="care-item">
                    <span className="care-label">Energy Level:</span>
                    <span className="care-value">{breed.energyLevel}</span>
                  </div>
                )}
              </div>

              {/* Good With */}
              {breed.goodWith && breed.goodWith.length > 0 && (
                <div className="good-with-section">
                  <h4>Good With</h4>
                  <div className="good-with-tags">
                    {breed.goodWith.map(item => (
                      <span key={item} className="good-with-tag">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Health Concerns */}
              {breed.healthConcerns && breed.healthConcerns.length > 0 && (
                <div className="health-concerns">
                  <h4>Health Considerations</h4>
                  <ul>
                    {breed.healthConcerns.map(concern => (
                      <li key={concern}>{concern}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Additional Info for Specific Species */}
              {selectedSpecies === 'bird' && (
                <div className="species-specific">
                  {breed.noiseLevel && (
                    <div className="care-item">
                      <span className="care-label">Noise Level:</span>
                      <span className="care-value">{breed.noiseLevel}</span>
                    </div>
                  )}
                  {breed.talkingAbility && (
                    <div className="care-item">
                      <span className="care-label">Talking Ability:</span>
                      <span className="care-value">{breed.talkingAbility}</span>
                    </div>
                  )}
                </div>
              )}

              {selectedSpecies === 'rabbit' && (
                <div className="species-specific">
                  {breed.activityLevel && (
                    <div className="care-item">
                      <span className="care-label">Activity Level:</span>
                      <span className="care-value">{breed.activityLevel}</span>
                    </div>
                  )}
                  {breed.housing && (
                    <div className="care-item">
                      <span className="care-label">Housing:</span>
                      <span className="care-value">{breed.housing}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {filteredBreeds.length === 0 && !loading && (
        <div className="empty-state">
          <div className="empty-icon">🐾</div>
          <h3>No Breed Information Available</h3>
          <p>
            {searchTerm 
              ? `No ${selectedSpecies} breeds found matching "${searchTerm}".`
              : `Breed information for ${selectedSpecies} is not available at the moment.`
            }
          </p>
        </div>
      )}

      {/* Information Source */}
      <div className="info-source">
        <p>
          <small>
            * Breed information is for general reference. Individual pets may vary in temperament and characteristics.
            Always consult with breeders, rescue organizations, or veterinarians for specific advice about a particular pet.
          </small>
        </p>
      </div>
    </div>
  );
};

export default BreedInfo;