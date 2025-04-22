
export const getPerformanceColor = (performance: string) => {
  switch (performance) {
    case 'Excellent':
      return 'bg-success/20 text-success font-semibold';
    case 'Good':
      return 'bg-info/20 text-info font-semibold';
    default:
      return 'bg-warning/20 text-warning font-semibold';
  }
};
