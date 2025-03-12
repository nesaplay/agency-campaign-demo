
import React from 'react';

const MapControls: React.FC = () => {
  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md flex flex-col">
      <button className="p-2 hover:bg-gray-100 rounded-t-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"></path><path d="M12 19V5"></path></svg>
      </button>
      <button className="p-2 hover:bg-gray-100">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>
      </button>
      <button className="p-2 hover:bg-gray-100 rounded-b-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 12-7 7-7-7"></path><path d="M12 5v14"></path></svg>
      </button>
    </div>
  );
};

export default MapControls;
