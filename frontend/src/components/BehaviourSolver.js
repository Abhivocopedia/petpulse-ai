import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { healthService, petsService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BEHAVIOR_ISSUES } from '../utils/constants';
import LoadingSpinner from './LoadingSpinner';

const BehaviorSolver = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState('');
  const [behaviorIssue, setBehaviorIssue] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('moderate');
  const [duration, setDuration] = useState('');
  const [solution, setSolution] = useState(null);
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

  const analyzeBehavior = async () => {
    if (!behaviorIssue) {
      toast.error('Please select a behavior issue');
      return;
    }

    if (!selectedPet) {
      toast.error('Please select a pet');
      return;
    }

    setLoading(true);
    try {
      const response = await healthService.behaviorSolve({
        petId: selectedPet,
        behaviorIssue,
        description,
        severity,
        duration
      });
      setSolution(response.data.solution);
      setShowResults(true);
      toast.success('Behavior analysis completed!');
    } catch (error) {
      console.error('Error analyzing behavior:', error);
      toast.error('Error analyzing behavior issue');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setBehaviorIssue('');
    setDescription('');
    setSeverity('moderate');
    setDuration('');
    setSolution(null);
    setShowResults(false);
  };

  const getBehaviorIcon = (issue) => {
    const icons = {
      barking: '🐕',
      chewing: '🦴',
      digging: '⛏️',
      scratching: '🐾',
      aggression: '⚡',
      anxiety: '😰',
      other: '❓'
    };
    return icons[issue] || '❓';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      immediate: '#dc3545',
      soon: '#ffc107',
      'long-term': '#28a745'
    };
    return colors[priority] || '#6c757d';
  };

  return (
    <div className="behavior-solver-container">
      <header className="page-header">
        <div>
          <h1>🎯 Behavior Problem Solver</h1>
          <p>Get AI-powered solutions for common pet behavior issues</p>
        </div>
      </header>

      {!showResults ? (
        <div className="behavior-form">
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

          {/* Behavior Issue Selection */}
          <div className="form-section">
            <h3>Behavior Issue</h3>
            <div className="behavior-issues-grid">
              {BEHAVIOR_ISSUES.map(issue => (
                <button
                  key={issue.value}
                  type="button"
                  onClick={() => setBehaviorIssue(issue.value)}
                  className={`behavior-issue-card ${behaviorIssue === issue.value ? 'active' : ''}`}
                >
                  <div className="issue-icon">
                    {getBehaviorIcon(issue.value)}
                  </div>
                  <span>{issue.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Issue Details */}
          <div className="form-section">
            <h3>Issue Details</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Severity</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="form-control"
                >
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
              </div>

              <div className="form-group">
                <label>Duration</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g., 2 weeks, several months..."
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Detailed Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the behavior in detail. When does it occur? What triggers it? How does your pet act?"
                rows="5"
                className="form-control"
              />
            </div>
          </div>

          {/* Analyze Button */}
          <div className="form-actions">
            <button
              onClick={analyzeBehavior}
              disabled={loading || !behaviorIssue}
              className="btn btn-primary btn-large"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="small" color="white" text="" />
                  Analyzing...
                </>
              ) : (
                'Get Solutions'
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Solutions Results */
        <div className="solutions-results">
          <div className="results-header">
            <h2>Behavior Solutions</h2>
            <button onClick={resetForm} className="btn btn-secondary">
              Analyze Another Issue
            </button>
          </div>

          {/* Assessment */}
          <div className="assessment-section">
            <h3>Assessment</h3>
            <div className="assessment-card">
              <p>{solution.assessment}</p>
            </div>
          </div>

          {/* Solutions */}
          <div className="solutions-section">
            <h3>Recommended Solutions</h3>
            <div className="solutions-list">
              {solution.recommendations.map((rec, index) => (
                <div key={index} className="solution-card">
                  <div className="solution-header">
                    <div 
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(rec.priority) }}
                    >
                      {rec.priority}
                    </div>
                    <h4>{rec.title}</h4>
                  </div>
                  <p>{rec.description}</p>
                  
                  {/* Additional tips based on priority */}
                  {rec.priority === 'immediate' && (
                    <div className="immediate-tips">
                      <strong>Immediate Actions:</strong>
                      <ul>
                        <li>Remove any immediate dangers or triggers</li>
                        <li>Ensure safety of all people and pets</li>
                        <li>Create a calm environment</li>
                        <li>Do not punish - this can worsen behavior</li>
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Training Tips */}
          <div className="training-tips">
            <h3>📚 General Training Tips</h3>
            <div className="tips-grid">
              <div className="tip-card">
                <h4>Positive Reinforcement</h4>
                <p>Reward good behavior with treats, praise, or play. Never punish unwanted behavior.</p>
              </div>
              <div className="tip-card">
                <h4>Consistency is Key</h4>
                <p>All family members should use the same commands and rules consistently.</p>
              </div>
              <div className="tip-card">
                <h4>Patience & Time</h4>
                <p>Behavior change takes time. Be patient and consistent with training.</p>
              </div>
              <div className="tip-card">
                <h4>Professional Help</h4>
                <p>For severe issues, consult a certified animal behaviorist or trainer.</p>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="important-notes">
            <h4>⚠️ Important Notes</h4>
            <ul>
              <li>Never use physical punishment - it can worsen behavior problems and damage trust</li>
              <li>Consult a veterinarian to rule out medical causes for behavior changes</li>
              <li>Some behaviors may require professional training assistance</li>
              <li>Always consider your pet's breed characteristics and natural instincts</li>
              <li>Behavior modification takes time and consistency</li>
            </ul>
          </div>

          {/* When to Seek Help */}
          <div className="help-section">
            <h4>When to Seek Professional Help</h4>
            <div className="warning-signs">
              <p>Contact a professional if your pet shows:</p>
              <ul>
                <li>Aggression toward people or other animals</li>
                <li>Self-harm or destructive behavior</li>
                <li>Extreme fear or anxiety</li>
                <li>Sudden behavior changes</li>
                <li>No improvement after consistent training</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {pets.length === 0 && !showResults && (
        <div className="empty-state">
          <div className="empty-icon">🐕</div>
          <h3>No Pets Found</h3>
          <p>Add a pet first to use the behavior solver.</p>
        </div>
      )}
    </div>
  );
};

export default BehaviorSolver;