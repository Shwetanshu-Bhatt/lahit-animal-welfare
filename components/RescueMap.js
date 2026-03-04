'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';
import Container from './ui/Container';
import { rescueLocations } from '@/data/rescues';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

// Custom marker icon
const createCustomIcon = () => {
  if (typeof window !== 'undefined') {
    const L = require('leaflet');
    return L.divIcon({
      className: 'custom-marker',
      html: `<div class="w-10 h-10 bg-[#164020] rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
             </div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });
  }
  return null;
};

function MapComponent() {
  const [mounted, setMounted] = useState(false);
  const [customIcon, setCustomIcon] = useState(null);

  useEffect(() => {
    setMounted(true);
    setCustomIcon(createCustomIcon());
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-[#F2CDAC] rounded-3xl flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-[#164020] mx-auto mb-4 animate-bounce" />
          <p className="text-[#401E01]">Loading map...</p>
        </div>
      </div>
    );
  }

  // Center of Uttarakhand
  const center = [30.0668, 79.0193];

  return (
    <MapContainer
      center={center}
      zoom={8}
      scrollWheelZoom={false}
      className="w-full h-full rounded-3xl z-0"
      style={{ height: '100%', minHeight: '500px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {rescueLocations.map((location) => (
        <Marker
          key={location.id}
          position={location.coordinates}
          icon={customIcon}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-[#401E01] mb-1">{location.name}</h3>
              <p className="text-sm text-[#401E01]/70 mb-2">{location.address}</p>
              <p className="text-sm font-medium text-[#164020]">
                {location.animalsHelped}+ animals helped
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default function RescueMap() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section className="section-padding bg-white" ref={sectionRef}>
      <Container>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#164020]/10 text-[#164020] rounded-full text-sm font-medium mb-4">
            <Navigation className="w-4 h-4" />
            Our Reach
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#401E01] mb-4">
            Rescue Locations
          </h2>
          <p className="text-lg text-[#401E01]/70 max-w-2xl mx-auto">
            We operate across Uttarakhand, with active rescue centers and feeding 
            points in multiple cities. Click on the markers to learn more.
          </p>
        </motion.div>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative h-[500px] rounded-3xl overflow-hidden shadow-xl"
        >
          {/* Import Leaflet CSS */}
          <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
            integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
            crossOrigin=""
          />
          <MapComponent />

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-white rounded-xl p-4 shadow-lg z-[400]">
            <h4 className="font-semibold text-[#401E01] mb-2 text-sm">Our Locations</h4>
            <div className="space-y-2">
              {rescueLocations.slice(0, 3).map((location) => (
                <div key={location.id} className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#164020] rounded-full" />
                  <span className="text-sm text-[#401E01]">{location.name}</span>
                </div>
              ))}
              {rescueLocations.length > 3 && (
                <p className="text-xs text-[#401E01]/60">
                  +{rescueLocations.length - 3} more locations
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Location Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-8"
        >
          {rescueLocations.map((location, index) => (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              className="bg-[#F2CDAC] rounded-xl p-4 hover:bg-[#164020]/10 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-[#164020] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-[#401E01] text-sm mb-1">
                    {location.name}
                  </h4>
                  <p className="text-xs text-[#401E01]/60">
                    {location.animalsHelped}+ animals helped
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
