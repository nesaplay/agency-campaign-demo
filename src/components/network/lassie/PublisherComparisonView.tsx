
import React, { useState } from 'react';
import { Publisher } from '../types';
import { Bot, X, BarChart2, DollarSign, Users, MapPin, ArrowDownUp, Sparkles } from 'lucide-react';

interface PublisherComparisonViewProps {
  publishers: Publisher[];
  onClose: () => void;
}

const PublisherComparisonView: React.FC<PublisherComparisonViewProps> = ({ publishers, onClose }) => {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Sort publishers based on current sort settings
  const sortedPublishers = [...publishers].sort((a, b) => {
    if (!sortField) return 0;
    
    let valueA: any;
    let valueB: any;
    
    switch (sortField) {
      case 'performance':
        const performanceRank = { 'Excellent': 3, 'Good': 2, 'Average': 1 };
        valueA = performanceRank[a.performance as keyof typeof performanceRank] || 0;
        valueB = performanceRank[b.performance as keyof typeof performanceRank] || 0;
        break;
      case 'subscribers':
        valueA = parseInt(a.subscribers.replace(/[^0-9]/g, ''), 10);
        valueB = parseInt(b.subscribers.replace(/[^0-9]/g, ''), 10);
        break;
      case 'engagement':
        valueA = parseFloat(a.engagement.replace(/[^0-9.]/g, ''));
        valueB = parseFloat(b.engagement.replace(/[^0-9.]/g, ''));
        break;
      case 'cpm':
        valueA = parseFloat(a.cpm.replace(/[^0-9.]/g, ''));
        valueB = parseFloat(b.cpm.replace(/[^0-9.]/g, ''));
        break;
      default:
        return 0;
    }
    
    return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
  });
  
  // Generate AI insights based on the publishers being compared
  const generateInsights = () => {
    if (publishers.length === 0) return [];
    
    const insights = [
      {
        title: "Performance Comparison",
        content: `Among these publishers, ${publishers.filter(p => p.performance === 'Excellent').length} have excellent performance ratings. ${publishers[0].name} offers the highest engagement metrics in this group.`
      },
      {
        title: "Audience Reach",
        content: `Combined, these publishers reach approximately ${publishers.reduce((sum, p) => sum + parseInt(p.subscribers.replace(/[^0-9]/g, ''), 10), 0).toLocaleString()} subscribers across ${[...new Set(publishers.map(p => p.location.split(',')[1]?.trim()))].length} different regions.`
      },
      {
        title: "Budget Efficiency",
        content: `For optimal budget allocation, prioritize ${publishers.sort((a, b) => parseFloat(a.cpm.replace(/[^0-9.]/g, '')) - parseFloat(b.cpm.replace(/[^0-9.]/g, ''))).slice(0, 2).map(p => p.name).join(' and ')} for the best value based on CPM rates versus performance metrics.`
      },
      {
        title: "Content Strategy",
        content: `The most common content categories across these publishers are ${[...new Set(publishers.flatMap(p => p.categories))].slice(0, 3).join(', ')}, suggesting campaigns focused on these topics would perform well.`
      }
    ];
    
    return insights;
  };
  
  const insights = generateInsights();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden flex flex-col w-full max-w-5xl h-[80vh]">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-empowerlocal-blue flex items-center justify-center">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-medium">Lassie Publisher Comparison</h3>
              <p className="text-xs text-gray-500">Analyzing {publishers.length} publishers</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          {/* AI Insights Section */}
          <div className="bg-gradient-to-r from-empowerlocal-blue/5 to-purple-500/5 rounded-lg border border-empowerlocal-blue/20 p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <h4 className="font-medium text-empowerlocal-navy">AI-Generated Insights</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {insights.map((insight, index) => (
                <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
                  <h5 className="font-medium text-sm text-gray-800 mb-1">{insight.title}</h5>
                  <p className="text-sm text-gray-600">{insight.content}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Comparison Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 text-sm text-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left font-medium">Publisher</th>
                  <th 
                    className="py-3 px-4 text-left font-medium cursor-pointer"
                    onClick={() => handleSort('performance')}
                  >
                    <div className="flex items-center">
                      <span>Performance</span>
                      <ArrowDownUp className={`h-3.5 w-3.5 ml-1 ${sortField === 'performance' ? 'text-empowerlocal-blue' : 'text-gray-400'}`} />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 text-left font-medium cursor-pointer"
                    onClick={() => handleSort('subscribers')}
                  >
                    <div className="flex items-center">
                      <span>Subscribers</span>
                      <ArrowDownUp className={`h-3.5 w-3.5 ml-1 ${sortField === 'subscribers' ? 'text-empowerlocal-blue' : 'text-gray-400'}`} />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 text-left font-medium cursor-pointer"
                    onClick={() => handleSort('engagement')}
                  >
                    <div className="flex items-center">
                      <span>Engagement</span>
                      <ArrowDownUp className={`h-3.5 w-3.5 ml-1 ${sortField === 'engagement' ? 'text-empowerlocal-blue' : 'text-gray-400'}`} />
                    </div>
                  </th>
                  <th 
                    className="py-3 px-4 text-left font-medium cursor-pointer"
                    onClick={() => handleSort('cpm')}
                  >
                    <div className="flex items-center">
                      <span>CPM</span>
                      <ArrowDownUp className={`h-3.5 w-3.5 ml-1 ${sortField === 'cpm' ? 'text-empowerlocal-blue' : 'text-gray-400'}`} />
                    </div>
                  </th>
                  <th className="py-3 px-4 text-left font-medium">Categories</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedPublishers.map(publisher => (
                  <tr key={publisher.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded flex items-center justify-center">
                          <img
                            src={publisher.logo}
                            alt={publisher.name}
                            className="max-h-8 max-w-8 object-contain"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{publisher.name}</div>
                          <div className="flex items-center text-xs text-gray-500">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{publisher.location}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block ${
                        publisher.performance === 'Excellent' ? 'bg-green-100 text-green-700' :
                        publisher.performance === 'Good' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {publisher.performance}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{publisher.subscribers}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <BarChart2 className="h-4 w-4 text-gray-400" />
                        <span>{publisher.engagement}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span>{publisher.cpm}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {publisher.categories.slice(0, 3).map((category, i) => (
                          <span key={i} className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                            {category}
                          </span>
                        ))}
                        {publisher.categories.length > 3 && (
                          <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                            +{publisher.categories.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublisherComparisonView;
