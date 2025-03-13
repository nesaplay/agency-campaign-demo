
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface DiscoveryCardProps {
  card: {
    id: string;
    type: string;
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    description: string;
    image: string;
    cta: string;
    ctaLink: string;
    isNew: boolean;
    color: string;
  };
}

const DiscoveryCard: React.FC<DiscoveryCardProps> = ({ card }) => {
  const { icon, title, subtitle, description, image, cta, ctaLink, isNew, color } = card;
  
  const typeClassName = color;
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row h-full">
          <div className="p-4 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-md ${typeClassName.split(' ')[0]}`}>
                {icon}
              </div>
              <div>
                <p className={`text-sm font-medium ${typeClassName.split(' ')[1]}`}>{title}</p>
                <p className="text-xs text-gray-500">{subtitle}</p>
              </div>
              {isNew && (
                <Badge className="ml-auto bg-green-500 text-white">New</Badge>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              {description}
            </p>
          </div>
          
          <div className="w-full md:w-24 h-24 md:h-auto bg-gray-100 flex-shrink-0">
            <img 
              src={image} 
              alt={subtitle} 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 md:border-t border-gray-100 flex justify-between">
        <Button variant="ghost" size="sm" className="text-gray-500 text-xs">
          More Like This
        </Button>
        <Button variant="ghost" size="sm" className="text-empowerlocal-blue" asChild>
          <Link to={ctaLink}>
            {cta} <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DiscoveryCard;
