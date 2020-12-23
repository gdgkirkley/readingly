export const formatDate = (date: string | Date): string => {
  let parsedDate: Date;

  if (typeof date === "string") {
    // Some Google Books dates do not come through as full YYYY-MM-DD dates.
    // If that is the case, then just return the string.
    if (checkIfFullDate(date)) {
      parsedDate = parseStringDateISO(date);
    } else {
      return date;
    }
  } else {
    parsedDate = date;
  }

  return parsedDate.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const applyDateFormat = (date: Date, format: Object) => {
  return date.toLocaleDateString("en-US", format);
};

export const formatTimeFromDate = (date: string | Date): string => {
  return new Date(date).toLocaleTimeString("en-US", {
    hour12: true,
    hour: "numeric",
    minute: "2-digit",
  });
};

export function formatDateForInput(date: Date): string {
  return `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${(
    "0" + date.getDate()
  ).slice(-2)}`;
}

function checkIfFullDate(date: string): boolean {
  let [y, m, d] = date.split(/\D/);
  if (!y || !m || !d) return false;
  return true;
}

export function parseStringDateISO(date: string): Date {
  let [y, m, d] = date.split(/\D/);
  let month = parseInt(m);
  let year = parseInt(y);
  let day = parseInt(d);
  return new Date(year, --month, day);
}
