
import React, { useState } from 'react';
import { Bot, ChevronDown, ChevronUp, Sparkles, TrendingUp, PieChart, Target } from 'lucide-react';
import { Publisher } from '../types';

interface AiInsightsProps {
  publisher: Publisher;
}

const AiInsights: React.FC<AiInsightsProps> = ({ publisher }) => {
  const [expanded, setExpanded] = useState(true);
  
  // Sample AI insights - in a real implementation, these would be generated dynamically
  const insights = [
    {
      id: 1,
      icon: TrendingUp,
      color: 'text-green-500',
      title: 'Performance Insight',
      content: `${publisher.name} shows strong performance for food-related and local business content with above-average engagement rates compared to similar publishers.`
    },
    {
      id: 2,
      icon: PieChart,
      color: 'text-purple-500',
      title: 'Audience Compatibility',
      content: `This publisher's audience demographic aligns well with clients in retail, restaurants, and professional services sectors.`
    },
    {
      id: 3,
      icon: Target,
      color: 'text-blue-500',
      title: 'Campaign Recommendation',
      content: `Based on historical performance, consider multimedia campaigns that include newsletter placements paired with website banner ads.`
    }
  ];

  if (!expanded) {
    return (
      <div className="mb-6">
        <button 
          onClick={() => setExpanded(true)}
          className="w-full flex items-center justify-between p-3 bg-empowerlocal-blue/5 border border-empowerlocal-blue/20 rounded-lg text-left hover:bg-empowerlocal-blue/10 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-empowerlocal-blue" />
            <span className="font-medium text-empowerlocal-navy">Lassie AI Insights</span>
          </div>
          <ChevronDown className="h-4 w-4 text-empowerlocal-blue" />
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <button 
        onClick={() => setExpanded(false)}
        className="w-full flex items-center justify-between p-3 bg-empowerlocal-blue/5 border border-empowerlocal-blue/20 rounded-lg text-left hover:bg-empowerlocal-blue/10 transition-colors mb-3"
      >
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-empowerlocal-blue" />
          <span className="font-medium text-empowerlocal-navy">Lassie AI Insights</span>
        </div>
        <ChevronUp className="h-4 w-4 text-empowerlocal-blue" />
      </button>
      
      <div className="space-y-3">
        {insights.map(insight => (
          <div key={insight.id} className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-start gap-3">
              <div className={`p-1.5 rounded-md bg-gray-50 ${insight.color}`}>
                <insight.icon className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h5 className="font-medium text-gray-800">{insight.title}</h5>
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                </div>
                <p className="mt-1 text-sm text-gray-600">{insight.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiInsights;
