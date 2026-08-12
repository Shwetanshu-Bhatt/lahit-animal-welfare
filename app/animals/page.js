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
    <main className="public-page min-h-screen bg-base-200">
      <Navbar />
      
      <div className="pt-28 pb-14 sm:pt-32 sm:pb-16">
        <Container>
          {/* Header */}
          <div className="mb-8 text-center sm:mb-12">
            <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              Find a Friend
            </span>
            <h1 className="mb-4 text-[2.4rem] font-black tracking-[-0.055em] text-primary sm:text-5xl">
              Animals for Adoption
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-primary/65 sm:text-lg">
              Give a loving home to a rescued animal. These furry friends are waiting for their forever families.
            </p>
          </div>

          {/* Filter */}
          <div className="mobile-scroll-row mb-8 flex gap-2 sm:mb-12 sm:flex-wrap sm:justify-center sm:gap-4">
            <button
              onClick={() => setFilter('all')}
              className={`min-h-11 shrink-0 rounded-full px-6 py-2 font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-white text-primary hover:bg-primary/10'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('Dog')}
              className={`min-h-11 shrink-0 rounded-full px-6 py-2 font-medium transition-colors ${
                filter === 'Dog'
                  ? 'bg-primary text-white'
                  : 'bg-white text-primary hover:bg-primary/10'
              }`}
            >
              Dogs
            </button>
            <button
              onClick={() => setFilter('Cat')}
              className={`min-h-11 shrink-0 rounded-full px-6 py-2 font-medium transition-colors ${
                filter === 'Cat'
                  ? 'bg-primary text-white'
                  : 'bg-white text-primary hover:bg-primary/10'
              }`}
            >
              Cats
            </button>
            <button
              onClick={() => setFilter('Other')}
              className={`min-h-11 shrink-0 rounded-full px-6 py-2 font-medium transition-colors ${
                filter === 'Other'
                  ? 'bg-primary text-white'
                  : 'bg-white text-primary hover:bg-primary/10'
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
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
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
                  <div className="p-3 sm:p-5">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h3 className="text-base font-bold text-primary sm:text-lg">{animal.name}</h3>
                      <span className="text-xs text-primary/60 sm:text-sm">{animal.type}</span>
                    </div>
                    <p className="mb-3 text-xs text-primary/70 sm:text-sm">{animal.breed} • {animal.age}</p>
                    <p className="mb-4 hidden text-sm text-primary/60 line-clamp-2 sm:block">
                      {animal.description}
                    </p>
                    <div className="hidden flex-wrap gap-2 sm:flex">
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
