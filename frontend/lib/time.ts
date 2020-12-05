const TWO_HOURS = 60 * 2;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * MINUTES_IN_HOUR;
const MILLISECONDS_IN_DAY =
  1000 * SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY;

export function getReadingTimeString(seconds: number): string {
  let finalString: string;

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

export function getPeriodFromNow(date: Date | string): string {
  let today: Date = new Date();
  let dayCount: number;
  let periodString: string;

  if (typeof date === "string") {
    date = new Date(date);
  }

  dayCount = Math.ceil((date.getTime() - today.getTime()) / MILLISECONDS_IN_DAY)

  periodString = dayCount > 0 ? `is <strong>${dayCount} day${dayCount === 1 ? "" : "s"}</strong> from now` : `was <strong>${Math.abs(dayCount)} day${dayCount === -1 ? "" : "s"}</strong> ago`

  return (periodString);
}
