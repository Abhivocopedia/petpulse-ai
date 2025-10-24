import { useState, useEffect } from 'react';
import { petsService } from '../services/api';
import { toast } from 'react-toastify';

// Custom hook for pet management
export const usePets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all pets
  const fetchPets = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await petsService.getAll();
      setPets(response.data.pets || []);
    } catch (err) {
      console.error('Error fetching pets:', err);
      setError(err.response?.data?.message || 'Failed to fetch pets');
      toast.error('Failed to load pets');
    } finally {
      setLoading(false);
    }
  };

  // Add new pet
  const addPet = async (petData) => {
    setLoading(true);
    
    try {
      const response = await petsService.create(petData);
      setPets(prev => [response.data.pet, ...prev]);
      toast.success('Pet added successfully!');
      return response.data.pet;
    } catch (err) {
      console.error('Error adding pet:', err);
      const errorMessage = err.response?.data?.message || 'Failed to add pet';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update pet
  const updatePet = async (id, petData) => {
    setLoading(true);
    
    try {
      const response = await petsService.update(id, petData);
      setPets(prev => prev.map(pet => 
        pet._id === id ? response.data.pet : pet
      ));
      toast.success('Pet updated successfully!');
      return response.data.pet;
    } catch (err) {
      console.error('Error updating pet:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update pet';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete pet
  const deletePet = async (id) => {
    setLoading(true);
    
    try {
      await petsService.delete(id);
      setPets(prev => prev.filter(pet => pet._id !== id));
      toast.success('Pet deleted successfully!');
    } catch (err) {
      console.error('Error deleting pet:', err);
      const errorMessage = err.response?.data?.message || 'Failed to delete pet';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get pet by ID
  const getPetById = (id) => {
    return pets.find(pet => pet._id === id);
  };

  // Get pets count by species
  const getPetsBySpecies = () => {
    const speciesCount = {};
    
    pets.forEach(pet => {
      speciesCount[pet.species] = (speciesCount[pet.species] || 0) + 1;
    });
    
    return speciesCount;
  };

  // Refresh pets list
  const refreshPets = () => {
    fetchPets();
  };

  // Load pets on component mount
  useEffect(() => {
    fetchPets();
  }, []);

  return {
    pets,
    loading,
    error,
    addPet,
    updatePet,
    deletePet,
    getPetById,
    getPetsBySpecies,
    refreshPets,
    fetchPets
  };
};

export default usePets;