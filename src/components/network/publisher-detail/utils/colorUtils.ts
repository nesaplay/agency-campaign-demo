
export const getPerformanceColor = (performance: string) => {
  switch (performance) {
    case 'Excellent':
      return 'bg-empowerlocal-success/10 text-empowerlocal-success';
    case 'Good':
      return 'bg-empowerlocal-info/10 text-empowerlocal-info';
    default:
      return 'bg-empowerlocal-warning/10 text-empowerlocal-warning';
  }
};
