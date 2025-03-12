
import React from 'react';

interface ResultsHeaderProps {
  activeBrowseMethod: string;
}

const ResultsHeader: React.FC<ResultsHeaderProps> = ({ activeBrowseMethod }) => {
  return (
    <div className="p-4 bg-white border-b border-gray-200">
      <h2 className="text-lg font-medium text-empowerlocal-navy">
        {activeBrowseMethod}
      </h2>
    </div>
  );
};

export default ResultsHeader;
