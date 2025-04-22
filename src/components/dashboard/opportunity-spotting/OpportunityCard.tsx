
import React from 'react';
import { Clock, Users, Zap, MapPin, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SeasonalEvent } from '@/components/network/types';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';

interface OpportunityCardProps {
  opportunity: SeasonalEvent;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity }) => {
  // Calculate days left to act
  const currentDate = new Date();
  const startDate = new Date(opportunity.startDate);
  const daysToStart = Math.ceil((startDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Generate random counts for demo purposes
  const publisherCount = Math.floor(Math.random() * 15) + 5;
  const potentialReach = Math.floor(Math.random() * 900) + 100;
  
  // Determine urgency
  const isUrgent = daysToStart <= 14;
  
  return (
    <Card className="w-[280px] min-w-[280px] hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className={`p-3 ${opportunity.color.replace('text-', 'bg-').replace('bg-', 'bg-opacity-20')} border-b border-gray-100`}>
          <div className="flex justify-between items-center">
            <h3 className={`font-medium truncate ${opportunity.color}`} title={opportunity.title}>
              {opportunity.title}
            </h3>
            {isUrgent && (
              <Badge className="bg-error">
                <Clock className="h-3 w-3 mr-1" /> Urgent
              </Badge>
            )}
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          <div className="flex justify-between items-center text-sm mb-1">
            <div className="text-gray-500 flex items-center">
              <Clock className="h-3 w-3 mr-1" /> Timing:
            </div>
            <span className="font-medium">
              {new Date(opportunity.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
              {new Date(opportunity.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Act within:</span>
              <span className={`font-medium ${isUrgent ? 'text-error' : 'text-gray-700'}`}>
                {daysToStart} days
              </span>
            </div>
            <Progress value={Math.max(0, 100 - (daysToStart / 30) * 100)} 
                      className={`h-2 ${isUrgent ? 'bg-red-100' : 'bg-gray-100'}`} />
          </div>
          
          <div className="py-2 px-3 bg-gray-50 rounded-md">
            <div className="flex items-center mb-2">
              <Zap className="h-4 w-4 text-empowerlocal-gold mr-2" />
              <span className="text-sm font-medium">Opportunity Highlights</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center">
                <Users className="h-3 w-3 text-gray-500 mr-1" />
                <span>{publisherCount} Publishers</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-3 w-3 text-gray-500 mr-1" />
                <span>{opportunity.regions[0]}</span>
              </div>
              <div className="flex items-center col-span-2">
                <span className="text-gray-500 mr-1">Est. Reach:</span>
                <span className="font-medium">{potentialReach}K+</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {opportunity.categories.map((category, idx) => (
              <Badge key={idx} variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0">
        <Button variant="outline" className="w-full text-empowerlocal-blue" size="sm" asChild>
          <Link to="/network-navigator">
            Explore <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OpportunityCard;
