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

export function parseStringDateISO (date: string): Date {
  let [y, m, d] = date.split(/\D/)
  let month = parseInt(m);
  let year = parseInt(y);
  let day = parseInt(d);
  return new Date(year, --month, day);
}