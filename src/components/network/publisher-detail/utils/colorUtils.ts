
export const getPerformanceColor = (performance: string) => {
  switch (performance) {
    case 'Excellent':
      return 'bg-green-100 text-green-600';
    case 'Good':
      return 'bg-blue-100 text-blue-600';
    default:
      return 'bg-yellow-100 text-yellow-600';
  }
};
