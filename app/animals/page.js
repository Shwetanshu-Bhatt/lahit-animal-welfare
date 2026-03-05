'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';

export default function AnimalsPage() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAnimals();
  }, []);

  async function fetchAnimals() {
    try {
      const res = await fetch('/api/animals');
      const data = await res.json();
      if (data.success) {
        // Filter only available animals for public view
        const available = data.data.filter(a => a.status === 'available' || a.status === 'pending');
        setAnimals(available);
      }
    } catch (error) {
      console.error('Error fetching animals:', error);
    } finally {
      setLoading(false);
    }
  }

  const filteredAnimals = filter === 'all' 
    ? animals 
    : animals.filter(a => a.type === filter);

  return (
    <main className="min-h-screen bg-[#F2CDAC]">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <Container>
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-[#164020]/10 text-[#164020] rounded-full text-sm font-medium mb-4">
              Find a Friend
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#401E01] mb-4">
              Animals for Adoption
            </h1>
            <p className="text-lg text-[#401E01]/70 max-w-2xl mx-auto">
              Give a loving home to a rescued animal. These furry friends are waiting for their forever families.
            </p>
          </div>

          {/* Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-[#164020] text-white'
                  : 'bg-white text-[#401E01] hover:bg-[#164020]/10'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('Dog')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                filter === 'Dog'
                  ? 'bg-[#164020] text-white'
                  : 'bg-white text-[#401E01] hover:bg-[#164020]/10'
              }`}
            >
              Dogs
            </button>
            <button
              onClick={() => setFilter('Cat')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                filter === 'Cat'
                  ? 'bg-[#164020] text-white'
                  : 'bg-white text-[#401E01] hover:bg-[#164020]/10'
              }`}
            >
              Cats
            </button>
            <button
              onClick={() => setFilter('Other')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                filter === 'Other'
                  ? 'bg-[#164020] text-white'
                  : 'bg-white text-[#401E01] hover:bg-[#164020]/10'
              }`}
            >
              Other
            </button>
          </div>

          {/* Animals Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-[#164020] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredAnimals.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#401E01]/60 text-lg">No animals available for adoption at the moment.</p>
              <p className="text-[#401E01]/40 mt-2">Check back soon!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAnimals.map((animal, index) => (
                <Card key={animal._id} className="overflow-hidden" padding="none">
                  <div className="relative aspect-square">
                    <Image
                      src={animal.image}
                      alt={animal.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        animal.status === 'available' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-yellow-500 text-white'
                      }`}>
                        {animal.status === 'available' ? 'Available' : 'Pending'}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-[#401E01]">{animal.name}</h3>
                      <span className="text-sm text-[#401E01]/60">{animal.type}</span>
                    </div>
                    <p className="text-sm text-[#401E01]/70 mb-3">{animal.breed} • {animal.age}</p>
                    <p className="text-sm text-[#401E01]/60 line-clamp-2 mb-4">
                      {animal.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {animal.vaccinated && (
                        <span className="px-2 py-1 bg-[#164020]/10 text-[#164020] text-xs rounded-full">
                          ✓ Vaccinated
                        </span>
                      )}
                      {animal.neutered && (
                        <span className="px-2 py-1 bg-[#164020]/10 text-[#164020] text-xs rounded-full">
                          ✓ Neutered
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </div>

      <Footer />
    </main>
  );
}
