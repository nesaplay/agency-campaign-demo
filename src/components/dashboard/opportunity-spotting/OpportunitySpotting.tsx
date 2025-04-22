import React from 'react';
import { Calendar, MapPin, ArrowRight, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import OpportunityCard from './OpportunityCard';
import { seasonalEvents } from '@/components/network/seasonal/data';
import { Link } from 'react-router-dom';
const OpportunitySpotting: React.FC = () => {
  // Get next 60 days of opportunities
  const today = new Date();
  const twoMonthsLater = new Date();
  twoMonthsLater.setDate(today.getDate() + 60);
  const upcomingOpportunities = seasonalEvents.filter(event => {
    const startDate = new Date(event.startDate);
    return startDate >= today && startDate <= twoMonthsLater;
  }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()).slice(0, 5);
  return <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      
    </div>;
};
export default OpportunitySpotting;