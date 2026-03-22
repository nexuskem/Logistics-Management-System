import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ExclamationTriangleIcon, BoltIcon, CheckCircleIcon, PauseCircleIcon } from '@heroicons/react/24/solid';

// Custom Icons
const createIcon = (color) => L.icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const defaultIcon = createIcon('blue');
const warningIcon = createIcon('orange');
const dangerIcon = createIcon('red');
const stoppedIcon = createIcon('grey');

const Tracking = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef({});

  const [vehicles, setVehicles] = useState([
    { id: 1, plate: 'KDC 123A', status: 'OK', speed: 65, lat: -1.2921, lng: 36.8219, driver: 'John Doe', destination: 'Nakuru' },
    { id: 2, plate: 'KBB 456X', status: 'SPEEDING', speed: 115, lat: -4.0435, lng: 39.6682, driver: 'Jane Kamau', destination: 'Nairobi' },
    { id: 3, plate: 'KCE 789B', status: 'ACCIDENT', speed: 0, lat: -0.1022, lng: 34.7617, driver: 'Peter Ochieng', destination: 'Eldoret' },
    { id: 4, plate: 'KXX 999Z', status: 'STOPPED', speed: 0, lat: -0.3031, lng: 36.0800, driver: 'Samuel Njoroge', destination: 'Naivasha' }
  ]);

  // Init Map
  useEffect(() => {
    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView([-0.0236, 37.9062], 6);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance.current);
    }
    
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update Markers
  useEffect(() => {
    if (!mapInstance.current) return;

    vehicles.forEach(v => {
      const pos = [v.lat, v.lng];
      const icon = v.status === 'ACCIDENT' ? dangerIcon : v.status === 'SPEEDING' ? warningIcon : v.status === 'STOPPED' ? stoppedIcon : defaultIcon;
      
      const popupContent = `
        <div class="text-gray-800 p-1 font-sans">
          <h3 class="font-bold text-lg mb-1">${v.plate}</h3>
          <p class="text-sm mb-1"><b>Driver:</b> ${v.driver}</p>
          <p class="text-sm mb-1"><b>Speed:</b> <span class="${v.speed > 80 ? 'text-red-600 font-bold' : ''}">${v.speed} km/h</span></p>
          <p class="text-sm mb-1"><b>Destination:</b> ${v.destination}</p>
          <p class="text-xs font-bold mt-2 px-2 py-1 rounded inline-block ${v.status === 'ACCIDENT' ? 'bg-red-100 text-red-700' : v.status === 'SPEEDING' ? 'bg-orange-100 text-orange-700' : v.status === 'STOPPED' ? 'bg-gray-200 text-gray-700' : 'bg-green-100 text-green-700'}">
            ${v.status}
          </p>
        </div>
      `;

      if (markersRef.current[v.id]) {
        markersRef.current[v.id].setLatLng(pos);
        markersRef.current[v.id].setIcon(icon);
        markersRef.current[v.id].setPopupContent(popupContent);
      } else {
        const marker = L.marker(pos, { icon }).addTo(mapInstance.current);
        marker.bindPopup(popupContent);
        markersRef.current[v.id] = marker;
      }
    });

  }, [vehicles]);

  // Simulate movement
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(prev => prev.map(v => {
        if (v.status === 'ACCIDENT' || v.status === 'STOPPED') return v;
        return {
          ...v,
          lat: v.lat + (Math.random() - 0.5) * 0.005,
          lng: v.lng + (Math.random() - 0.5) * 0.005,
          speed: v.status === 'SPEEDING' 
            ? Math.floor(105 + Math.random() * 20) 
            : Math.floor(50 + Math.random() * 30)
        };
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      <div className="w-80 bg-brand-panel border border-brand-border rounded-2xl shadow-xl flex flex-col overflow-hidden">
        <div className="p-5 border-b border-brand-border bg-brand-panel-light/30">
          <h2 className="text-xl font-bold text-white tracking-wide">Live Fleet Status</h2>
          <p className="text-xs text-brand-muted mt-1 uppercase tracking-wider font-bold">{vehicles.length} Vehicles Tracked</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {vehicles.map(v => (
            <div key={v.id} onClick={() => mapInstance.current.flyTo([v.lat, v.lng], 12)} className="bg-brand-dark p-4 rounded-xl border border-brand-border shadow-md transition-all hover:-translate-y-1 cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-white text-lg">{v.plate}</span>
                {v.status === 'OK' && <CheckCircleIcon className="w-6 h-6 text-green-500" />}
                {v.status === 'SPEEDING' && <BoltIcon className="w-6 h-6 text-brand-orange animate-pulse" />}
                {v.status === 'ACCIDENT' && <ExclamationTriangleIcon className="w-6 h-6 text-red-500 animate-bounce" />}
                {v.status === 'STOPPED' && <PauseCircleIcon className="w-6 h-6 text-gray-400" />}
              </div>
              <div className="text-sm text-brand-muted space-y-1.5 font-medium">
                <div className="flex justify-between">
                  <span>Speed:</span>
                  <span className={`${v.speed > 80 ? 'text-red-400 font-bold' : 'text-green-400'}`}>{v.speed} km/h</span>
                </div>
                <div className="flex justify-between">
                  <span>Driver:</span>
                  <span className="text-white">{v.driver}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={`${v.status === 'ACCIDENT' ? 'text-red-500' : v.status === 'SPEEDING' ? 'text-brand-orange' : v.status === 'STOPPED' ? 'text-gray-400' : 'text-green-500'} font-bold text-xs px-2 py-0.5 rounded-full bg-white/5`}>
                    {v.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-brand-panel border border-brand-border rounded-2xl shadow-xl overflow-hidden relative">
        <div className="absolute top-4 left-0 right-0 z-[400] flex justify-center pointer-events-none">
           <div className="bg-brand-dark/90 backdrop-blur-md px-6 py-3 rounded-full border border-brand-border shadow-2xl flex gap-6 pointer-events-auto items-center">
             <span className="flex items-center gap-2 text-sm font-bold text-green-400"><div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div> Normal</span>
             <span className="flex items-center gap-2 text-sm font-bold text-brand-orange"><div className="w-3 h-3 rounded-full bg-brand-orange shadow-[0_0_8px_rgba(249,115,22,0.8)]"></div> Speeding</span>
             <span className="flex items-center gap-2 text-sm font-bold text-gray-400"><div className="w-3 h-3 rounded-full bg-gray-400 shadow-[0_0_8px_rgba(156,163,175,0.8)]"></div> Stopped</span>
             <span className="flex items-center gap-2 text-sm font-bold text-red-500"><div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div> Accident</span>
           </div>
        </div>
        <div ref={mapRef} className="w-full h-full z-0 font-sans"></div>
      </div>
    </div>
  );
};

export default Tracking;
