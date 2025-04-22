
export const getPerformanceColor = (performance: string) => {
  switch (performance) {
    case 'Excellent':
      return 'bg-success/20 text-success font-semibold data-text';
    case 'Good':
      return 'bg-info/20 text-info font-semibold data-text';
    default:
      return 'bg-warning/20 text-warning font-semibold data-text';
  }
};
