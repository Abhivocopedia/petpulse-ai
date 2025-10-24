import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { healthService, petsService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { COMMON_SYMPTOMS } from '../utils/constants';
import { getUrgencyColor } from '../utils/helpers';
import LoadingSpinner from './LoadingSpinner';

const SymptomChecker = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await petsService.getAll();
      setPets(response.data.pets || []);
      if (response.data.pets.length > 0) {
        setSelectedPet(response.data.pets[0]._id);
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  const addSymptom = () => {
    if (currentSymptom && !symptoms.includes(currentSymptom)) {
      setSymptoms([...symptoms, currentSymptom]);
      setCurrentSymptom('');
    }
  };

  const removeSymptom = (symptomToRemove) => {
    setSymptoms(symptoms.filter(s => s !== symptomToRemove));
  };

  const addCommonSymptom = (symptom) => {
    if (!symptoms.includes(symptom)) {
      setSymptoms([...symptoms, symptom]);
    }
  };

  const analyzeSymptoms = async () => {
    if (symptoms.length === 0) {
      toast.error('Please add at least one symptom');
      return;
    }

    if (!selectedPet) {
      toast.error('Please select a pet');
      return;
    }

    setLoading(true);
    try {
      const response = await healthService.symptomCheck({
        petId: selectedPet,
        symptoms,
        additionalInfo
      });
      setAnalysis(response.data.analysis);
      setShowResults(true);
      toast.success('Symptom analysis completed!');
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      toast.error('Error analyzing symptoms');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSymptoms([]);
    setAdditionalInfo('');
    setAnalysis(null);
    setShowResults(false);
  };

  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case 'emergency': return '🚨';
      case 'urgent': return '⚠️';
      case 'monitor': return '✅';
      default: return '📋';
    }
  };

  return (
    <div className="symptom-checker-container">
      <header className="page-header">
        <div>
          <h1>🔍 Symptom Checker AI</h1>
          <p>AI-powered analysis of your pet's symptoms</p>
        </div>
      </header>

      {!showResults ? (
        <div className="symptom-form">
          {/* Pet Selection */}
          <div className="form-section">
            <h3>Select Pet</h3>
            <select
              value={selectedPet}
              onChange={(e) => setSelectedPet(e.target.value)}
              className="form-control"
            >
              {pets.map(pet => (
                <option key={pet._id} value={pet._id}>
                  {pet.name} ({pet.species})
                </option>
              ))}
            </select>
          </div>

          {/* Symptoms Input */}
          <div className="form-section">
            <h3>Describe Symptoms</h3>
            <div className="symptoms-input">
              <div className="input-group">
                <input
                  type="text"
                  value={currentSymptom}
                  onChange={(e) => setCurrentSymptom(e.target.value)}
                  placeholder="Enter symptom..."
                  list="commonSymptoms"
                  className="form-control"
                />
                <datalist id="commonSymptoms">
                  {COMMON_SYMPTOMS.map(symptom => (
                    <option key={symptom} value={symptom} />
                  ))}
                </datalist>
                <button
                  type="button"
                  onClick={addSymptom}
                  className="btn btn-secondary"
                >
                  Add Symptom
                </button>
              </div>
              
              {/* Common Symptoms Quick Select */}
              <div className="common-symptoms">
                <p>Common symptoms:</p>
                <div className="symptoms-tags">
                  {COMMON_SYMPTOMS.slice(0, 8).map(symptom => (
                    <button
                      key={symptom}
                      type="button"
                      onClick={() => addCommonSymptom(symptom)}
                      className={`symptom-tag ${symptoms.includes(symptom) ? 'active' : ''}`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Symptoms */}
              {symptoms.length > 0 && (
                <div className="selected-symptoms">
                  <p>Selected symptoms:</p>
                  <div className="symptoms-list">
                    {symptoms.map(symptom => (
                      <span key={symptom} className="symptom-item">
                        {symptom}
                        <button
                          onClick={() => removeSymptom(symptom)}
                          className="remove-symptom"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="form-section">
            <h3>Additional Information</h3>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Describe when symptoms started, severity, behavior changes, or any other relevant information..."
              rows="4"
              className="form-control"
            />
          </div>

          {/* Analyze Button */}
          <div className="form-actions">
            <button
              onClick={analyzeSymptoms}
              disabled={loading || symptoms.length === 0}
              className="btn btn-primary btn-large"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="small" color="white" text="" />
                  Analyzing...
                </>
              ) : (
                'Analyze Symptoms'
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Analysis Results */
        <div className="analysis-results">
          <div className="results-header">
            <h2>Analysis Results</h2>
            <button onClick={resetForm} className="btn btn-secondary">
              Check Another Pet
            </button>
          </div>

          {/* Urgency Level */}
          <div 
            className="urgency-alert"
            style={{ borderColor: getUrgencyColor(analysis.urgency) }}
          >
            <div className="urgency-header">
              <span className="urgency-icon">{getUrgencyIcon(analysis.urgency)}</span>
              <h3 style={{ color: getUrgencyColor(analysis.urgency) }}>
                {analysis.urgency.toUpperCase()}
              </h3>
            </div>
            <p>{analysis.assessment}</p>
          </div>

          {/* Recommendations */}
          <div className="recommendations-section">
            <h3>Recommendations</h3>
            <div className="recommendations-list">
              {analysis.recommendations.map((rec, index) => (
                <div key={index} className="recommendation-card">
                  <div className="rec-priority">
                    Priority: <span className={`priority-${rec.priority}`}>{rec.priority}</span>
                  </div>
                  <h4>{rec.title}</h4>
                  <p>{rec.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* First Aid Steps */}
          {analysis.firstAidSteps && analysis.firstAidSteps.length > 0 && (
            <div className="first-aid-section">
              <h3>First Aid Steps</h3>
              <div className="first-aid-steps">
                {analysis.firstAidSteps.map((step, index) => (
                  <div key={index} className="first-aid-step">
                    <div className="step-number">{step.step}</div>
                    <div className="step-description">{step.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Important Notes */}
          <div className="important-notes">
            <h4>⚠️ Important Notes</h4>
            <ul>
              <li>This is an AI-powered assessment and should not replace professional veterinary care</li>
              <li>Always consult with a qualified veterinarian for accurate diagnosis and treatment</li>
              <li>In emergency situations, go to the nearest veterinary clinic immediately</li>
              <li>Contact your veterinarian if symptoms persist or worsen</li>
            </ul>
          </div>

          {/* Emergency Contacts */}
          <div className="emergency-contacts">
            <h4>Emergency Resources</h4>
            <div className="contact-list">
              <div className="contact-item">
                <strong>Animal Poison Control:</strong> (888) 426-4435
              </div>
              <div className="contact-item">
                <strong>Pet Emergency Hotline:</strong> (855) 764-7661
              </div>
              <div className="contact-item">
                <strong>Local Emergency Vet:</strong> Check your local directory
              </div>
            </div>
          </div>
        </div>
      )}

      {pets.length === 0 && !showResults && (
        <div className="empty-state">
          <div className="empty-icon">🐕</div>
          <h3>No Pets Found</h3>
          <p>Add a pet first to use the symptom checker.</p>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;