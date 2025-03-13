
import React from 'react';
import { Lock, Users, Globe } from 'lucide-react';

interface VisibilityOptionsProps {
  visibility: 'private' | 'team' | 'public';
  setVisibility: (visibility: 'private' | 'team' | 'public') => void;
}

const VisibilityOptions: React.FC<VisibilityOptionsProps> = ({ visibility, setVisibility }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Visibility
      </label>
      <div className="space-y-2">
        <label className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
          <input
            type="radio"
            name="visibility"
            checked={visibility === 'private'}
            onChange={() => setVisibility('private')}
            className="mr-3"
          />
          <Lock className="h-5 w-5 text-gray-500 mr-2" />
          <div>
            <div className="font-medium">Private</div>
            <div className="text-sm text-gray-500">Only you can see this list</div>
          </div>
        </label>
        
        <label className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
          <input
            type="radio"
            name="visibility"
            checked={visibility === 'team'}
            onChange={() => setVisibility('team')}
            className="mr-3"
          />
          <Users className="h-5 w-5 text-gray-500 mr-2" />
          <div>
            <div className="font-medium">Team</div>
            <div className="text-sm text-gray-500">Your team members can view and edit</div>
          </div>
        </label>
        
        <label className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
          <input
            type="radio"
            name="visibility"
            checked={visibility === 'public'}
            onChange={() => setVisibility('public')}
            className="mr-3"
          />
          <Globe className="h-5 w-5 text-gray-500 mr-2" />
          <div>
            <div className="font-medium">Public</div>
            <div className="text-sm text-gray-500">Anyone in your organization can view</div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default VisibilityOptions;
