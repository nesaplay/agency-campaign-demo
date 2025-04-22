
export const getPerformanceColor = (performance: string) => {
  switch (performance) {
    case 'Excellent':
      return 'bg-success/10 text-success';
    case 'Good':
      return 'bg-info/10 text-info';
    default:
      return 'bg-warning/10 text-warning';
  }
};
