
import React from 'react';

const MapBackground: React.FC = () => {
  return (
    <>
      {/* Background pattern for "map" */}
      <div className="absolute w-full h-full opacity-20"
        style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.4\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
        }}
      ></div>
      
      {/* Map Outline */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">
        {/* Simplified US West Coast Outline */}
        <path 
          d="M100,200 L150,150 L200,100 L250,80 L300,100 L320,150 L350,200 L370,250 L400,300 L450,350 L500,370 L550,350 L580,300 L600,250 L580,200 L550,150 L500,120 L450,100 L400,120 L350,150 L320,200 L300,250 L250,300 L200,320 L150,300 L120,250 Z" 
          fill="none" 
          stroke="#c1d9f0" 
          strokeWidth="2"
        />
        
        {/* State lines */}
        <path 
          d="M200,100 L400,300 M300,100 L500,350" 
          stroke="#c1d9f0" 
          strokeWidth="1" 
          strokeDasharray="5,5"
        />
      </svg>
    </>
  );
};

export default MapBackground;
