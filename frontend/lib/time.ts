const TWO_HOURS = 60 * 2;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * MINUTES_IN_HOUR;
const HOURS_IN_DAY = 24;

export function getReadingTimeString(seconds: number): string {
  let finalString;

  const days = Math.floor(seconds / (SECONDS_IN_HOUR * HOURS_IN_DAY));
  const hours = Math.floor(
    (seconds % (SECONDS_IN_HOUR * HOURS_IN_DAY)) / SECONDS_IN_HOUR
  );
  const minutes = Math.floor((seconds % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE);
  const second = Math.floor(seconds % SECONDS_IN_MINUTE);

  const daysDisplay =
    days > 0 ? days + (days === 1 ? " day, " : " days, ") : "";
  const hoursDisplay =
    hours > 0 ? hours + (hours === 1 ? " hour, " : " hours, ") : "";
  const minutesDisplay =
    minutes > 0 ? minutes + (minutes === 1 ? " minute, " : " minutes, ") : "";
  const secondsDisplay =
    second > 0 ? second + (seconds === 1 ? " second" : " seconds") : "";

  finalString = daysDisplay + hoursDisplay;

  if (daysDisplay === "") {
    finalString += minutesDisplay;
  }

  return finalString.replace(/,\s*$/, "");
}

export function getPercentage(current: number, total: number): number {
  return round((current / total) * 100, 1);
}

export function round(value: number, precision: number): number {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}
