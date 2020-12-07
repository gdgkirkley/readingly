export const formatDate = (date: string | Date): string => {
  let parsedDate: Date

  if(typeof date === 'string') {
    parsedDate = parseStringDateISO(date);
  } else {
    parsedDate = date
  }

  return parsedDate.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export function formatDateForInput(date: Date): string {
  return `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}`
}

export function parseStringDateISO (date: string): Date {
  let [y, m, d] = date.split(/\D/)
  let month = parseInt(m);
  let year = parseInt(y);
  let day = parseInt(d);
  return new Date(year, --month, day);
}