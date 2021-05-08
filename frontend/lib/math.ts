export function getPercentage(current: number, total: number): number {
    return round((current / total) * 100, 1);
  }

export function round(value: number, precision: number): number {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}